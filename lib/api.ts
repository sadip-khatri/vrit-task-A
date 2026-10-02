const API_BASE = 'https://fakestoreapi.com';

export class ApiError extends Error {
  constructor(message: string, public readonly status?: number) { super(message); this.name = 'ApiError'; }
}

/** Shared fetch boundary: normalizes HTTP, network, and invalid response errors. */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...init, headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0 (compatible; VritStore/1.0)', ...init?.headers } });
  } catch {
    throw new ApiError('We could not reach the store. Check your connection and try again.');
  }
  if (!response.ok) throw new ApiError(response.status === 400 || response.status === 401 ? 'The username or password was rejected by the store (HTTP ' + response.status + ').' : 'The store could not load this information (HTTP ' + response.status + '). Please try again.', response.status);
  try { return await response.json() as T; }
  catch { throw new ApiError('The store returned an unreadable response.', response.status); }
}

export async function login(username: string, password: string): Promise<string> {
  const result = await apiFetch<{ token: string }>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });
  if (!result.token) throw new ApiError("The store did not return a login token.");
  return result.token;
}