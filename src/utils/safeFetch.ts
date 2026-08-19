/**
 * Safe Fetch Utility
 * Prevents "Unexpected token '<' / 'T' ... is not valid JSON" errors
 * by safely inspecting the HTTP status, response content-type, and raw text
 * before attempting JSON.parse.
 */

export interface SafeFetchResult<T = any> {
  ok: boolean;
  status: number;
  data: T;
  rawText?: string;
  error?: string;
}

export async function safeFetchJson<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit,
  fallback?: T
): Promise<SafeFetchResult<T>> {
  try {
    const res = await fetch(input, init);
    const text = await res.text();
    const contentType = res.headers.get('content-type') || '';

    // Check if the body looks like JSON
    const trimmed = text.trim();
    if (
      contentType.includes('application/json') ||
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))
    ) {
      try {
        const data = JSON.parse(trimmed);
        return {
          ok: res.ok,
          status: res.status,
          data,
          rawText: text
        };
      } catch (parseErr: any) {
        return {
          ok: false,
          status: res.status,
          data: (fallback !== undefined ? fallback : { error: 'Failed to parse JSON response' }) as T,
          rawText: text,
          error: parseErr.message
        };
      }
    }

    // Response is HTML or plain text error page
    return {
      ok: res.ok,
      status: res.status,
      data: (fallback !== undefined ? fallback : { error: trimmed || `HTTP ${res.status} ${res.statusText}` }) as T,
      rawText: text,
      error: trimmed || `HTTP ${res.status}`
    };
  } catch (networkErr: any) {
    return {
      ok: false,
      status: 0,
      data: (fallback !== undefined ? fallback : { error: networkErr?.message || 'Network request failed' }) as T,
      error: networkErr?.message || 'Network request failed'
    };
  }
}
