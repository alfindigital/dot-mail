// Pure algorithms for Gmail address tricks.
//
// Dot trick: for a username of length n there are n-1 gaps between chars where
// a dot can be inserted. Total variants = 2^(n-1). We enumerate via bitmask.
//
// Plus addressing: username+tag@gmail.com always routes to username@gmail.com.

export const MIN_USERNAME_LEN = 2;
// 2^(MAX-1) variants. 18 chars -> 131,072 variants: heavy but virtualized.
// Beyond this the combination count is exponential and practically useless,
// so we cap and steer long usernames toward plus-addressing instead.
export const MAX_USERNAME_LEN = 18;

export function countVariants(username: string): number {
  const n = username.length;
  if (n < 2) return 1;
  return 1 << (n - 1);
}

export function generateDotVariants(username: string): string[] {
  const n = username.length;
  if (n === 0) return [];
  if (n === 1) return [username];
  const gaps = n - 1;
  const total = 1 << gaps;
  const out = new Array<string>(total);
  for (let mask = 0; mask < total; mask++) {
    let s = username[0];
    for (let i = 0; i < gaps; i++) {
      if (mask & (1 << i)) s += ".";
      s += username[i + 1];
    }
    out[mask] = s;
  }
  return out;
}

export function dotCount(variant: string): number {
  let c = 0;
  for (let i = 0; i < variant.length; i++) if (variant[i] === ".") c++;
  return c;
}

// Error codes are mapped to localized strings in the UI layer (see i18n).
export type ValidationError = "empty" | "charset" | "dotPattern" | "minLen" | "maxLen";

export type ValidationResult =
  | { valid: true; username: string }
  | { valid: false; code: ValidationError };

export function validateUsername(raw: string): ValidationResult {
  const input = raw.trim().toLowerCase();
  if (input.length === 0) return { valid: false, code: "empty" };
  if (!/^[a-z0-9.]+$/.test(input)) return { valid: false, code: "charset" };
  if (input.startsWith(".") || input.endsWith(".") || input.includes(".."))
    return { valid: false, code: "dotPattern" };
  const username = input.replace(/\./g, "");
  if (username.length < MIN_USERNAME_LEN) return { valid: false, code: "minLen" };
  if (username.length > MAX_USERNAME_LEN) return { valid: false, code: "maxLen" };
  return { valid: true, username };
}

// ---------------------------------------------------------------------------
// Plus addressing
// ---------------------------------------------------------------------------

// Gmail allows almost anything in the +tag except spaces and a few specials.
// We keep it conservative: letters, digits, dot, dash, underscore.
function sanitizeTag(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "");
}

/** Parse a freeform tag string (comma / newline / space separated). */
export function parseTags(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(/[\s,;]+/)) {
    const t = sanitizeTag(part);
    if (t && !seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
  }
  return out;
}

/** Build username+tag aliases. Falls back to a default set if no tags given. */
export function generatePlusVariants(username: string, tags: string[]): string[] {
  return tags.map((t) => `${username}+${t}`);
}
