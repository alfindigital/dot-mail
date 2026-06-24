// Single source of truth for the canonical site origin. Used by SEO meta,
// JSON-LD, sitemap, and any absolute URL. Override at build time with SITE_URL.
const RAW =
  (typeof process !== "undefined" && process.env?.SITE_URL) || "https://dotmail.alfindigital.com";

export const SITE_URL = RAW.replace(/\/$/, "");
export const SITE_NAME = "DotMail";

/** Build an absolute URL from a path ("/" -> origin). */
export function abs(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
