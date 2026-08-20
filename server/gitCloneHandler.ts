import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export interface ClonedFile {
  path: string;
  content: string;
  language: string;
  isModified: boolean;
}

export interface CloneResult {
  success: boolean;
  repoName?: string;
  branch?: string;
  files?: ClonedFile[];
  count?: number;
  commit?: {
    hash: string;
    message: string;
    author: string;
    timestamp: string;
  };
  error?: string;
}

// Binary / large asset extensions to skip
const BINARY_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'webp', 'bmp', 'tiff',
  'mp3', 'wav', 'ogg', 'mp4', 'webm', 'mov', 'avi', 'mkv',
  'zip', 'tar', 'gz', '7z', 'rar', 'bz2',
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
  'exe', 'dll', 'so', 'dylib', 'bin', 'iso', 'woff', 'woff2', 'ttf', 'eot',
  'pyc', 'pyo', 'pyd', 'class', 'jar', 'db', 'sqlite', 'sqlite3'
]);

// Ignored directories
const IGNORED_DIRS = new Set([
  '.git', 'node_modules', '.next', '.nuxt', 'dist', 'build', 'out',
  '.venv', 'venv', '__pycache__', '.cache', '.idea', '.vscode',
  'coverage', '.turbo', '.terraform'
]);

function detectLanguage(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase().replace('.', '');
  switch (ext) {
    case 'js':
    case 'jsx':
    case 'mjs':
    case 'cjs':
      return 'javascript';
    case 'ts':
    case 'tsx':
    case 'mts':
    case 'cts':
      return 'typescript';
    case 'py':
      return 'python';
    case 'json':
      return 'json';
    case 'html':
    case 'htm':
      return 'html';
    case 'css':
    case 'scss':
    case 'sass':
    case 'less':
      return 'css';
    case 'md':
    case 'markdown':
      return 'markdown';
    case 'yaml':
    case 'yml':
      return 'yaml';
    case 'sql':
      return 'sql';
    case 'sh':
    case 'bash':
    case 'zsh':
      return 'shell';
    case 'rs':
      return 'rust';
    case 'go':
      return 'go';
    case 'java':
      return 'java';
    case 'cpp':
    case 'cc':
    case 'cxx':
    case 'c':
    case 'h':
    case 'hpp':
      return 'cpp';
    case 'xml':
      return 'xml';
    case 'env':
    case 'gitignore':
    case 'dockerignore':
      return 'plaintext';
    default:
      return 'plaintext';
  }
}

// Extract human-readable repo name from Git URL
export function parseRepoName(rawUrl: string): string {
  let cleaned = rawUrl.trim().replace(/\.git$/i, '').replace(/\/+$/, '');
  const parts = cleaned.split(/[/:]/).filter(Boolean);
  if (parts.length > 0) {
    const lastPart = parts[parts.length - 1];
    return lastPart.replace(/[^a-zA-Z0-9_-]/g, '') || 'cloned-repository';
  }
  return 'cloned-repository';
}

// Normalize Git URL for standard cloning
export function normalizeGitUrl(inputUrl: string, token?: string): string {
  let url = inputUrl.trim();

  // If input is like "owner/repo" shorthand
  if (/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(url)) {
    url = `https://github.com/${url}.git`;
  }

  // If git@github.com:owner/repo.git format
  if (url.startsWith('git@github.com:')) {
    url = url.replace('git@github.com:', 'https://github.com/');
  }

  // Inject token if provided for private repository authentication
  if (token && url.startsWith('https://github.com/')) {
    url = url.replace('https://github.com/', `https://${encodeURIComponent(token)}@github.com/`);
  }

  return url;
}

// Recursively traverse directory and collect readable files
async function collectFiles(dir: string, baseDir: string, filesList: ClonedFile[], maxFiles = 250): Promise<void> {
  if (filesList.length >= maxFiles) return;

  const entries = await fs.promises.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (filesList.length >= maxFiles) break;

    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name) || entry.name.startsWith('.')) {
        continue;
      }
      await collectFiles(fullPath, baseDir, filesList, maxFiles);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase().replace('.', '');
      if (BINARY_EXTENSIONS.has(ext)) {
        continue;
      }

      try {
        const stats = await fs.promises.stat(fullPath);
        // Skip files > 1.5MB to avoid memory/browser rendering issues
        if (stats.size > 1.5 * 1024 * 1024) {
          continue;
        }

        const content = await fs.promises.readFile(fullPath, 'utf8');
        // Basic check for binary zero bytes
        if (content.includes('\0')) {
          continue;
        }

        filesList.push({
          path: relPath,
          content,
          language: detectLanguage(relPath),
          isModified: false
        });
      } catch (err) {
        // Skip unreadable files
      }
    }
  }
}

/**
 * Executes a shallow git clone of the target repository and extracts files & metadata.
 */
export async function executeGitClone(
  rawUrl: string,
  branch?: string,
  token?: string
): Promise<CloneResult> {
  const repoName = parseRepoName(rawUrl);
  const targetUrl = normalizeGitUrl(rawUrl, token);
  const tmpDir = path.join(os.tmpdir(), `ide-clone-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);

  try {
    const cloneArgs = ['clone', '--depth', '1'];
    if (branch && branch.trim()) {
      cloneArgs.push('--branch', branch.trim());
    }
    cloneArgs.push(targetUrl, tmpDir);

    // Run git clone with 35s timeout
    await execFileAsync('git', cloneArgs, {
      timeout: 35000,
      env: {
        ...process.env,
        GIT_TERMINAL_PROMPT: '0' // Prevent hanging on authentication prompts
      }
    });

    // Get current branch
    let detectedBranch = branch || 'main';
    try {
      const { stdout: branchOut } = await execFileAsync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: tmpDir });
      if (branchOut.trim()) {
        detectedBranch = branchOut.trim();
      }
    } catch {}

    // Get last commit details
    let commitInfo = {
      hash: 'init',
      message: `Initial clone of ${repoName}`,
      author: 'Repository Author',
      timestamp: 'Recently'
    };

    try {
      const { stdout: logOut } = await execFileAsync(
        'git',
        ['log', '-1', '--pretty=format:%h|%s|%an|%cr'],
        { cwd: tmpDir }
      );
      if (logOut.trim()) {
        const [hash, message, author, timestamp] = logOut.trim().split('|');
        commitInfo = {
          hash: hash || 'init',
          message: message || `Clone ${repoName}`,
          author: author || 'Author',
          timestamp: timestamp || 'Recently'
        };
      }
    } catch {}

    // Collect readable files
    const collectedFiles: ClonedFile[] = [];
    await collectFiles(tmpDir, tmpDir, collectedFiles, 300);

    if (collectedFiles.length === 0) {
      return {
        success: false,
        error: 'Repository cloned successfully, but no readable source text files were found.'
      };
    }

    return {
      success: true,
      repoName,
      branch: detectedBranch,
      files: collectedFiles,
      count: collectedFiles.length,
      commit: commitInfo
    };
  } catch (err: any) {
    const errMsg = err.stderr || err.message || 'Git clone failed';
    if (errMsg.includes('not found') || errMsg.includes('404')) {
      return { success: false, error: `Repository not found. Please verify the URL or repository privacy settings.` };
    }
    if (errMsg.includes('Authentication failed') || errMsg.includes('could not read Username')) {
      return { success: false, error: `Authentication failed. For private repositories, please provide a GitHub Personal Access Token.` };
    }
    if (errMsg.includes('Remote branch') && errMsg.includes('not found')) {
      return { success: false, error: `Branch "${branch}" not found in repository.` };
    }
    return {
      success: false,
      error: errMsg.length > 200 ? errMsg.substring(0, 200) + '...' : errMsg
    };
  } finally {
    // Clean up temporary clone directory
    try {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    } catch {}
  }
}
