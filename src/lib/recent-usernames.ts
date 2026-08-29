const KEY = "dotmail:recent";
const MAX = 5;
const VERSION = 2;

export interface RecentEntry {
  u: string;
  labels?: Record<string, string>;
}

type Envelope = { v: number; list: RecentEntry[] };

function parse(raw: string | null): RecentEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && Array.isArray((parsed as Envelope).list)) {
      return ((parsed as Envelope).list as unknown[])
        .map((x): RecentEntry | null => {
          if (typeof x === "string") return { u: x };
          if (x && typeof x === "object" && typeof (x as RecentEntry).u === "string") {
            return x as RecentEntry;
          }
          return null;
        })
        .filter((x): x is RecentEntry => !!x)
        .slice(0, MAX);
    }
    // Legacy shape: plain array of strings
    if (Array.isArray(parsed)) {
      return parsed
        .filter((x) => typeof x === "string")
        .map((u: string) => ({ u }))
        .slice(0, MAX);
    }
    return [];
  } catch {
    return [];
  }
}

function write(list: RecentEntry[]): void {
  try {
    const env: Envelope = { v: VERSION, list };
    window.localStorage.setItem(KEY, JSON.stringify(env));
  } catch {
    /* ignore */
  }
}

export function getRecent(): RecentEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return parse(window.localStorage.getItem(KEY));
  } catch {
    return [];
  }
}

export function addRecent(username: string): RecentEntry[] {
  if (typeof window === "undefined") return [];
  const current = getRecent();
  const existing = current.find((e) => e.u === username);
  const others = current.filter((e) => e.u !== username);
  const next = [existing ?? { u: username }, ...others].slice(0, MAX);
  write(next);
  return next;
}

export function removeRecent(username: string): RecentEntry[] {
  if (typeof window === "undefined") return [];
  const next = getRecent().filter((e) => e.u !== username);
  write(next);
  return next;
}

export function setLabels(username: string, labels: Record<string, string>): RecentEntry[] {
  if (typeof window === "undefined") return [];
  const current = getRecent();
  const others = current.filter((e) => e.u !== username);
  const next = [{ u: username, labels }, ...others].slice(0, MAX);
  write(next);
  return next;
}

export function getLabelsFor(username: string): Record<string, string> {
  return getRecent().find((e) => e.u === username)?.labels ?? {};
}

export function subscribeRecent(cb: (list: RecentEntry[]) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === null || e.key === KEY) cb(getRecent());
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}
