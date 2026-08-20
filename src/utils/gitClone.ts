import { RepoFile } from '../types';

export interface CloneRepoOptions {
  url: string;
  branch?: string;
  token?: string;
}

export interface PopularRepoPreset {
  id: string;
  name: string;
  owner: string;
  repo: string;
  branch: string;
  description: string;
  language: string;
  badgeColor: string;
  stars: string;
}

export const POPULAR_GIT_PRESETS: PopularRepoPreset[] = [
  {
    id: 'express',
    name: 'Express.js',
    owner: 'expressjs',
    repo: 'express',
    branch: 'master',
    description: 'Fast, unopinionated, minimalist web framework for Node.js',
    language: 'JavaScript',
    badgeColor: '#f7df1e',
    stars: '64k+'
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    owner: 'fastapi',
    repo: 'fastapi',
    branch: 'master',
    description: 'Modern, high-performance web framework for Python APIs',
    language: 'Python',
    badgeColor: '#3572A5',
    stars: '78k+'
  },
  {
    id: 'flask',
    name: 'Flask',
    owner: 'pallets',
    repo: 'flask',
    branch: 'main',
    description: 'The Python micro framework for building web applications',
    language: 'Python',
    badgeColor: '#3776ab',
    stars: '68k+'
  },
  {
    id: 'todomvc-react',
    name: 'TodoMVC React',
    owner: 'tastejs',
    repo: 'todomvc',
    branch: 'master',
    description: 'Clean reference architecture with state management and CSS styling',
    language: 'TypeScript / JS',
    badgeColor: '#61dafb',
    stars: '30k+'
  },
  {
    id: 'shadcn-ui',
    name: 'shadcn / ui',
    owner: 'shadcn-ui',
    repo: 'ui',
    branch: 'main',
    description: 'Beautifully designed accessible components with Tailwind CSS',
    language: 'TypeScript',
    badgeColor: '#3178c6',
    stars: '70k+'
  }
];

export interface ParsedGitUrl {
  isValid: boolean;
  owner?: string;
  repo?: string;
  branch?: string;
  rawUrl: string;
  displayName: string;
  isGitHub: boolean;
}

export function parseGitUrl(input: string): ParsedGitUrl {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: false, rawUrl: trimmed, displayName: '', isGitHub: false };
  }

  // Check for owner/repo pattern (e.g., "expressjs/express")
  const ownerRepoMatch = trimmed.match(/^([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)$/);
  if (ownerRepoMatch) {
    return {
      isValid: true,
      owner: ownerRepoMatch[1],
      repo: ownerRepoMatch[2].replace(/\.git$/i, ''),
      rawUrl: `https://github.com/${trimmed}`,
      displayName: `${ownerRepoMatch[1]}/${ownerRepoMatch[2]}`,
      isGitHub: true
    };
  }

  // Check for standard GitHub URL: https://github.com/owner/repo/tree/branch or https://github.com/owner/repo
  const githubUrlMatch = trimmed.match(/github\.com\/([^/]+)\/([^/.]+)(?:\/tree\/([^/]+))?/);
  if (githubUrlMatch) {
    const owner = githubUrlMatch[1];
    const repo = githubUrlMatch[2].replace(/\.git$/i, '');
    const branch = githubUrlMatch[3];
    return {
      isValid: true,
      owner,
      repo,
      branch,
      rawUrl: trimmed,
      displayName: `${owner}/${repo}`,
      isGitHub: true
    };
  }

  // Generic Git URL (GitLab, Bitbucket, self-hosted, git://, etc.)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('git@') || trimmed.endsWith('.git')) {
    const parts = trimmed.replace(/\.git$/i, '').split(/[/:]/).filter(Boolean);
    const lastPart = parts[parts.length - 1] || 'repository';
    return {
      isValid: true,
      rawUrl: trimmed,
      displayName: lastPart,
      isGitHub: trimmed.includes('github.com')
    };
  }

  return { isValid: false, rawUrl: trimmed, displayName: trimmed, isGitHub: false };
}

/**
 * Call backend /api/git/clone with fallback
 */
export async function cloneRemoteRepository(
  options: CloneRepoOptions
): Promise<{
  success: boolean;
  repoName?: string;
  branch?: string;
  files?: RepoFile[];
  count?: number;
  commit?: {
    hash: string;
    message: string;
    author: string;
    timestamp: string;
  };
  error?: string;
}> {
  try {
    const res = await fetch('/api/git/clone', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: options.url.trim(),
        branch: options.branch?.trim() || undefined,
        token: options.token?.trim() || undefined
      })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return data;
    }

    return {
      success: false,
      error: data.error || `Failed to clone repository (HTTP ${res.status}).`
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error while attempting to clone repository.'
    };
  }
}
