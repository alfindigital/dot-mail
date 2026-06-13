const KEY = "dotmail:recent";
const MAX = 5;
const VERSION = 1;

type Envelope = { v: number; list: string[] };

function parse(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    // New shape: { v, list }
    if (parsed && typeof parsed === "object" && Array.isArray((parsed as Envelope).list)) {
      return (parsed as Envelope).list.filter((x) => typeof x === "string").slice(0, MAX);
    }
    // Legacy shape: plain array
    if (Array.isArray(parsed)) {
      return parsed.filter((x) => typeof x === "string").slice(0, MAX);
    }
    return [];
  } catch {
    return [];
  }
}

function write(list: string[]): void {
  try {
    const env: Envelope = { v: VERSION, list };
    window.localStorage.setItem(KEY, JSON.stringify(env));
  } catch {
    /* ignore */
  }
}

export function getRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return parse(window.localStorage.getItem(KEY));
  } catch {
    return [];
  }
}

export function addRecent(username: string): string[] {
  if (typeof window === "undefined") return [];
  const current = getRecent().filter((u) => u !== username);
  const next = [username, ...current].slice(0, MAX);
  write(next);
  return next;
}

export function removeRecent(username: string): string[] {
  if (typeof window === "undefined") return [];
  const next = getRecent().filter((u) => u !== username);
  write(next);
  return next;
}

/** Subscribe to cross-tab changes to the recent list. */
export function subscribeRecent(cb: (list: string[]) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === null || e.key === KEY) cb(getRecent());
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}
