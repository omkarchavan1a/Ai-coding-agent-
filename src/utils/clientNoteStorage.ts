import { Note } from '../types';

const NOTES_STORAGE_KEY = 'ide_benchmark_notes_v1';

export const INITIAL_DEMO_NOTES: Note[] = [
  {
    _id: "note_1",
    title: "Python Agent Spec",
    content: "Design 4 autonomous agent coordination engine for zero-config CLI execution with Gemini 2.5 Flash and SQLite storage.",
    category: "Study",
    tags: ["python", "ai-agent", "gemini", "sqlite"],
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    _id: "note_2",
    title: "API Spec",
    content: "Express routes for notes: GET /notes/search, GET /notes/meta, POST /notes, PUT /notes/:id, DELETE /notes/:id.",
    category: "Work",
    tags: ["express", "node", "backend", "urgent"],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    _id: "note_3",
    title: "UI Wireframes",
    content: "Design modern responsive layout with dark IDE workspace, agent thought streaming, and git commit visualizer.",
    category: "Work",
    tags: ["frontend", "react", "tailwind"],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    _id: "note_4",
    title: "Weekend Grocery List",
    content: "Almond milk, organic coffee beans, sourdough bread, avocados, Greek yogurt, dark chocolate.",
    category: "Personal",
    tags: ["shopping", "food"],
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  }
];

export function getClientStoredNotes(): Note[] {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_NOTES));
      return INITIAL_DEMO_NOTES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_DEMO_NOTES;
  } catch {
    return INITIAL_DEMO_NOTES;
  }
}

export function saveClientStoredNotes(notes: Note[]): void {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.warn('[ClientNotes] Storage write failed:', e);
  }
}

export function queryClientNotes(params: { search?: string; category?: string; tag?: string }): Note[] {
  let notes = getClientStoredNotes();

  if (params.category) {
    const cat = params.category.toLowerCase();
    notes = notes.filter(n => n.category && n.category.toLowerCase() === cat);
  }

  if (params.tag) {
    const tg = params.tag.toLowerCase();
    notes = notes.filter(n => Array.isArray(n.tags) && n.tags.some(t => t.toLowerCase() === tg));
  }

  if (params.search) {
    const q = params.search.toLowerCase().trim();
    notes = notes.filter(n => 
      (n.title && n.title.toLowerCase().includes(q)) ||
      (n.content && n.content.toLowerCase().includes(q)) ||
      (n.category && n.category.toLowerCase().includes(q)) ||
      (Array.isArray(n.tags) && n.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  return notes;
}

export function getClientNotesMetadata(): { categories: string[]; tags: string[] } {
  const notes = getClientStoredNotes();
  const categories = Array.from(new Set(notes.map(n => n.category).filter(Boolean))) as string[];
  const tags = Array.from(new Set(notes.flatMap(n => n.tags || []).filter(Boolean))) as string[];
  return { categories, tags };
}

export function createClientNote(data: { title?: string; content: string; category?: string; tags?: string | string[] }): Note {
  const notes = getClientStoredNotes();
  
  let parsedTags: string[] = [];
  if (Array.isArray(data.tags)) {
    parsedTags = data.tags;
  } else if (typeof data.tags === 'string') {
    parsedTags = data.tags.split(',').map(t => t.trim()).filter(Boolean);
  }

  const newNote: Note = {
    _id: 'note_' + Date.now(),
    title: (data.title || 'Untitled Note').trim(),
    content: data.content.trim(),
    category: data.category?.trim() || 'General',
    tags: parsedTags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updated = [newNote, ...notes];
  saveClientStoredNotes(updated);
  return newNote;
}

export function deleteClientNote(id: string): boolean {
  const notes = getClientStoredNotes();
  const filtered = notes.filter(n => n._id !== id);
  if (filtered.length !== notes.length) {
    saveClientStoredNotes(filtered);
    return true;
  }
  return false;
}

export function resetClientNotes(): Note[] {
  saveClientStoredNotes(INITIAL_DEMO_NOTES);
  return INITIAL_DEMO_NOTES;
}
