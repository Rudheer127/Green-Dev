interface ApiResult<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

const GITHUB_API_BASE = 'https://api.github.com';

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

export async function fetchRepoTree(
  owner: string,
  repo: string
): Promise<ApiResult<{ path: string; sha: string; type: string }[]>> {
  try {
    const res = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
      { headers: getHeaders() }
    );
    if (res.status === 404) {
      return { success: false, data: null, error: 'Repository not found or is private. GreenDev Coach only works with public repos.' };
    }
    if (res.status === 403) {
      return { success: false, data: null, error: 'GitHub rate limit reached. Try again in a few minutes.' };
    }
    if (!res.ok) {
      return { success: false, data: null, error: `GitHub API error: ${res.status}` };
    }
    const json = await res.json();
    return { success: true, data: json.tree || [], error: null };
  } catch {
    return { success: false, data: null, error: 'Could not reach GitHub. Check your connection.' };
  }
}

export async function fetchFileContent(
  owner: string,
  repo: string,
  path: string
): Promise<ApiResult<string>> {
  try {
    const res = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
      { headers: getHeaders() }
    );
    if (!res.ok) return { success: false, data: null, error: `Could not fetch ${path}` };
    const json = await res.json();
    if (json.encoding === 'base64' && json.content) {
      const content = Buffer.from(json.content, 'base64').toString('utf-8');
      return { success: true, data: content, error: null };
    }
    return { success: false, data: null, error: 'Unexpected file encoding' };
  } catch {
    return { success: false, data: null, error: `Failed to fetch ${path}` };
  }
}

export async function fetchRepoMeta(
  owner: string,
  repo: string
): Promise<ApiResult<{ stars: number; language: string; size: number; topics: string[] }>> {
  try {
    const res = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
      headers: getHeaders(),
    });
    if (!res.ok) return { success: false, data: null, error: 'Failed to fetch repo metadata' };
    const json = await res.json();
    return {
      success: true,
      data: {
        stars: json.stargazers_count,
        language: json.language,
        size: json.size,
        topics: json.topics || [],
      },
      error: null,
    };
  } catch {
    return { success: false, data: null, error: 'Failed to fetch repo metadata' };
  }
}
