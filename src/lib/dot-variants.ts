// Pure algorithm to generate all dot-trick variants for a Gmail username.
// For a username of length n, there are n-1 gaps between chars where a dot
// can be inserted. Total variants = 2^(n-1). We enumerate via bitmask.

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

export type ValidationResult =
  | { valid: true; username: string }
  | { valid: false; error: string };

export function validateUsername(raw: string): ValidationResult {
  const username = raw.trim().toLowerCase();
  if (username.length === 0) return { valid: false, error: "Masukkan username Gmail." };
  if (username.length < 2) return { valid: false, error: "Minimal 2 karakter." };
  if (username.length > 30) return { valid: false, error: "Maksimal 30 karakter." };
  if (!/^[a-z0-9]+$/.test(username))
    return {
      valid: false,
      error: "Hanya huruf a–z dan angka 0–9. Tanpa titik, spasi, atau simbol.",
    };
  return { valid: true, username };
}
