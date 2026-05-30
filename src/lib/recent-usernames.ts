const KEY = "dotmail:recent";
const MAX = 5;

export function getRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string").slice(0, MAX) : [];
  } catch {
    return [];
  }
}

export function addRecent(username: string): string[] {
  if (typeof window === "undefined") return [];
  const current = getRecent().filter((u) => u !== username);
  const next = [username, ...current].slice(0, MAX);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

export function removeRecent(username: string): string[] {
  if (typeof window === "undefined") return [];
  const next = getRecent().filter((u) => u !== username);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}
