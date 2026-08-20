import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

// Safely determine writable database path with automatic corruption recovery
function resolveSqliteDatabase(): { db: DatabaseSync; dbPath: string } {
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  
  // Primary location: ./data in local/Cloud Run, or /tmp in serverless environments
  const candidateDirs = isServerless 
    ? ['/tmp', path.join(process.cwd(), 'data')]
    : [path.join(process.cwd(), 'data'), '/tmp'];

  for (const dir of candidateDirs) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const dbPath = path.join(dir, 'workspace_database.sqlite');
      const walPath = dbPath + '-wal';
      const shmPath = dbPath + '-shm';

      // Check if existing file is healthy before opening
      let instance: DatabaseSync | null = null;

      try {
        instance = new DatabaseSync(dbPath);
        // Test real read operation
        instance.exec('SELECT count(*) FROM sqlite_master;');
      } catch (err: any) {
        console.warn(`[SQLite] Database file at ${dbPath} was unreadable (${err?.message}). Cleaning and recreating...`);
        try {
          if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
          if (fs.existsSync(walPath)) fs.unlinkSync(walPath);
          if (fs.existsSync(shmPath)) fs.unlinkSync(shmPath);
        } catch (cleanupErr) {
          console.warn('[SQLite] Cleanup warning:', cleanupErr);
        }
        instance = new DatabaseSync(dbPath);
      }

      try {
        instance.exec('PRAGMA foreign_keys = ON;');
      } catch (pragmaErr) {
        console.warn('[SQLite] Pragma config warning:', pragmaErr);
      }

      console.log(`[SQLite] Initialized healthy database at: ${dbPath}`);
      return { db: instance, dbPath };
    } catch (err) {
      console.warn(`[SQLite] Candidate directory ${dir} failed:`, err);
    }
  }

  // Fallback to in-memory database if all filesystem paths fail
  console.log(`[SQLite] Falling back to in-memory SQLite database`);
  const memDb = new DatabaseSync(':memory:');
  return { db: memDb, dbPath: ':memory:' };
}

const { db, dbPath: SQLITE_DB_PATH } = resolveSqliteDatabase();
export { db, SQLITE_DB_PATH };

export interface StoredPasscodeRecord {
  id: string;
  developerName: string;
  salt: string;
  hashAlgorithm: string;
  passcodeHash: string;
  encryptedPayload: string;
  hint?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityState {
  failedAttempts: number;
  lockoutUntil: number | null;
  isSessionUnlocked: boolean;
  updatedAt: string;
}

export interface NoteRecord {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ==================== INITIALIZE SCHEMAS ====================
export function initializeSqliteDatabase(seedPasscodeFn?: () => StoredPasscodeRecord) {
  // 1. Passcode Configuration Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS passcode_config (
      id TEXT PRIMARY KEY DEFAULT 'current',
      encrypted_payload TEXT NOT NULL,
      salt TEXT NOT NULL,
      passcode_hash TEXT NOT NULL,
      developer_name TEXT NOT NULL,
      hint TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 2. Global Security State Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS security_state (
      id TEXT PRIMARY KEY DEFAULT 'global',
      failed_attempts INTEGER DEFAULT 0,
      lockout_until INTEGER DEFAULT NULL,
      is_session_unlocked INTEGER DEFAULT 0,
      updated_at TEXT NOT NULL
    );
  `);

  // 3. Security Audit Logs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS security_audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      ip_address TEXT NOT NULL,
      success INTEGER NOT NULL,
      details TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // 4. Notes Table (Target App Easy Notes Database)
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      tags TEXT DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 5. Autonomous Agent Runs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS agent_runs (
      id TEXT PRIMARY KEY,
      prompt TEXT NOT NULL,
      agent_role TEXT NOT NULL,
      status TEXT NOT NULL,
      files_modified_count INTEGER DEFAULT 0,
      token_count INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  // Ensure security state row exists
  const existingState = db.prepare('SELECT id FROM security_state WHERE id = ?').get('global');
  if (!existingState) {
    db.prepare(`
      INSERT INTO security_state (id, failed_attempts, lockout_until, is_session_unlocked, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run('global', 0, null, 0, new Date().toISOString());
  }

  // Seed passcode if table is empty and seeder is provided
  const existingPasscode = db.prepare('SELECT id FROM passcode_config WHERE id = ?').get('current');
  if (!existingPasscode && seedPasscodeFn) {
    const initialRecord = seedPasscodeFn();
    savePasscodeRecord(initialRecord);
  }

  // Seed notes if empty
  const countRow = db.prepare('SELECT COUNT(*) as count FROM notes').get() as { count: number };
  if (!countRow || countRow.count === 0) {
    resetNotesDatabase();
  }

  console.log('[SQLite] All database tables and initial records loaded successfully.');
}

// ==================== PASSCODE REPOSITORY ====================
export function getPasscodeRecord(): StoredPasscodeRecord | null {
  try {
    const row = db.prepare('SELECT * FROM passcode_config WHERE id = ?').get('current') as any;
    if (!row) return null;
    return {
      id: row.id,
      developerName: row.developer_name,
      salt: row.salt,
      hashAlgorithm: 'PBKDF2-HMAC-SHA256 (100,000 rounds)',
      passcodeHash: row.passcode_hash,
      encryptedPayload: row.encrypted_payload,
      hint: row.hint || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  } catch (err) {
    console.error('[SQLite] Error reading passcode record:', err);
    return null;
  }
}

export function savePasscodeRecord(record: StoredPasscodeRecord) {
  try {
    db.prepare(`
      INSERT INTO passcode_config (id, encrypted_payload, salt, passcode_hash, developer_name, hint, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        encrypted_payload = excluded.encrypted_payload,
        salt = excluded.salt,
        passcode_hash = excluded.passcode_hash,
        developer_name = excluded.developer_name,
        hint = excluded.hint,
        updated_at = excluded.updated_at
    `).run(
      'current',
      record.encryptedPayload,
      record.salt,
      record.passcodeHash,
      record.developerName,
      record.hint || null,
      record.createdAt,
      record.updatedAt
    );
  } catch (err) {
    console.error('[SQLite] Error saving passcode record:', err);
    throw err;
  }
}

export function deletePasscodeRecord() {
  try {
    db.prepare('DELETE FROM passcode_config WHERE id = ?').run('current');
  } catch (err) {
    console.error('[SQLite] Error deleting passcode record:', err);
  }
}

// ==================== SECURITY STATE REPOSITORY ====================
export function getSecurityState(): SecurityState {
  try {
    const row = db.prepare('SELECT * FROM security_state WHERE id = ?').get('global') as any;
    if (!row) {
      return { failedAttempts: 0, lockoutUntil: null, isSessionUnlocked: false, updatedAt: new Date().toISOString() };
    }
    return {
      failedAttempts: row.failed_attempts || 0,
      lockoutUntil: row.lockout_until || null,
      isSessionUnlocked: Boolean(row.is_session_unlocked),
      updatedAt: row.updated_at
    };
  } catch (err) {
    return { failedAttempts: 0, lockoutUntil: null, isSessionUnlocked: false, updatedAt: new Date().toISOString() };
  }
}

export function updateSecurityState(update: Partial<SecurityState>) {
  try {
    const current = getSecurityState();
    const next = { ...current, ...update, updatedAt: new Date().toISOString() };
    db.prepare(`
      INSERT INTO security_state (id, failed_attempts, lockout_until, is_session_unlocked, updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        failed_attempts = excluded.failed_attempts,
        lockout_until = excluded.lockout_until,
        is_session_unlocked = excluded.is_session_unlocked,
        updated_at = excluded.updated_at
    `).run('global', next.failedAttempts, next.lockoutUntil, next.isSessionUnlocked ? 1 : 0, next.updatedAt);
  } catch (err) {
    console.error('[SQLite] Error updating security state:', err);
  }
}

export function logAuditEvent(eventType: string, ipAddress: string, success: boolean, details?: string) {
  try {
    db.prepare(`
      INSERT INTO security_audit_logs (event_type, ip_address, success, details, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(eventType, ipAddress, success ? 1 : 0, details || null, new Date().toISOString());
  } catch (err) {
    console.error('[SQLite] Error logging audit event:', err);
  }
}

export function getAuditLogs(limit: number = 20) {
  try {
    return db.prepare(`
      SELECT id, event_type as eventType, ip_address as ipAddress, success, details, created_at as createdAt
      FROM security_audit_logs
      ORDER BY id DESC
      LIMIT ?
    `).all(limit);
  } catch (err) {
    return [];
  }
}

// ==================== NOTES REPOSITORY ====================
export function getAllNotes(filter?: { search?: string; category?: string; tag?: string }): NoteRecord[] {
  try {
    const rows = db.prepare(`SELECT * FROM notes ORDER BY created_at DESC`).all() as any[];
    let notes: NoteRecord[] = rows.map(r => {
      let parsedTags: string[] = [];
      try {
        parsedTags = JSON.parse(r.tags || '[]');
      } catch {
        parsedTags = [];
      }
      return {
        _id: r.id,
        title: r.title,
        content: r.content,
        category: r.category,
        tags: parsedTags,
        createdAt: r.created_at,
        updatedAt: r.updated_at
      };
    });

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      notes = notes.filter(n => 
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (filter?.category) {
      const cat = filter.category.toLowerCase();
      notes = notes.filter(n => n.category.toLowerCase() === cat);
    }

    if (filter?.tag) {
      const t = filter.tag.toLowerCase();
      notes = notes.filter(n => n.tags.some(tag => tag.toLowerCase() === t));
    }

    return notes;
  } catch (err) {
    console.error('[SQLite] Error fetching notes:', err);
    return [];
  }
}

export function getNoteById(id: string): NoteRecord | null {
  try {
    const r = db.prepare(`SELECT * FROM notes WHERE id = ?`).get(id) as any;
    if (!r) return null;
    let parsedTags: string[] = [];
    try {
      parsedTags = JSON.parse(r.tags || '[]');
    } catch {
      parsedTags = [];
    }
    return {
      _id: r.id,
      title: r.title,
      content: r.content,
      category: r.category,
      tags: parsedTags,
      createdAt: r.created_at,
      updatedAt: r.updated_at
    };
  } catch (err) {
    return null;
  }
}

export function createNote(note: { title?: string; content: string; category?: string; tags?: string[] }): NoteRecord {
  const newId = `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const tagsJson = JSON.stringify(note.tags || []);
  const category = (note.category || 'General').trim();
  const title = note.title || 'Untitled Note';

  db.prepare(`
    INSERT INTO notes (id, title, content, category, tags, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(newId, title, note.content, category, tagsJson, now, now);

  return {
    _id: newId,
    title,
    content: note.content,
    category,
    tags: note.tags || [],
    createdAt: now,
    updatedAt: now
  };
}

export function updateNote(id: string, note: { title?: string; content?: string; category?: string; tags?: string[] }): NoteRecord | null {
  const existing = getNoteById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const title = note.title !== undefined ? note.title : existing.title;
  const content = note.content !== undefined ? note.content : existing.content;
  const category = note.category !== undefined ? note.category.trim() : existing.category;
  const tags = note.tags !== undefined ? note.tags : existing.tags;
  const tagsJson = JSON.stringify(tags);

  db.prepare(`
    UPDATE notes
    SET title = ?, content = ?, category = ?, tags = ?, updated_at = ?
    WHERE id = ?
  `).run(title, content, category, tagsJson, now, id);

  return {
    _id: id,
    title,
    content,
    category,
    tags,
    createdAt: existing.createdAt,
    updatedAt: now
  };
}

export function deleteNote(id: string): boolean {
  try {
    const res = db.prepare(`DELETE FROM notes WHERE id = ?`).run(id);
    return res.changes > 0;
  } catch (err) {
    return false;
  }
}

export function resetNotesDatabase() {
  try {
    db.exec(`DELETE FROM notes;`);
    const insertNote = db.prepare(`
      INSERT INTO notes (id, title, content, category, tags, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const initialNotes = [
      {
        id: "note_1",
        title: "Project Strategy & Architecture",
        content: "Review Express MVC architecture and plan node-easy-notes-app organization updates with SQLite database engine.",
        category: "Work",
        tags: JSON.stringify(["express", "node", "backend", "sqlite"]),
        createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      },
      {
        id: "note_2",
        title: "Grocery & Meal Prep List",
        content: "Buy organic milk, free-range eggs, sourdough bread, and fresh coffee beans.",
        category: "Personal",
        tags: JSON.stringify(["shopping", "food", "urgent"]),
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: "note_3",
        title: "AI Agent Assignment Requirements",
        content: "Ensure Python 3.11+ agent explores repo, identifies files, creates execution plan, modifies code, and tests against SQLite database.",
        category: "Study",
        tags: JSON.stringify(["python", "ai-agent", "gemini", "sqlite"]),
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      }
    ];

    for (const n of initialNotes) {
      insertNote.run(n.id, n.title, n.content, n.category, n.tags, n.createdAt, n.updatedAt);
    }
  } catch (err) {
    console.error('[SQLite] Error resetting notes table:', err);
  }
}

// ==================== AGENT RUNS REPOSITORY ====================
export function logAgentRun(run: { prompt: string; agentRole: string; status: string; filesModifiedCount?: number; tokenCount?: number }) {
  try {
    const id = `run_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    db.prepare(`
      INSERT INTO agent_runs (id, prompt, agent_role, status, files_modified_count, token_count, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, run.prompt, run.agentRole, run.status, run.filesModifiedCount || 0, run.tokenCount || 0, new Date().toISOString());
  } catch (err) {
    console.error('[SQLite] Error logging agent run:', err);
  }
}
