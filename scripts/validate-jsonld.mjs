#!/usr/bin/env node
/**
 * Fetches a deployed URL and validates that every <script type="application/ld+json">
 * block parses as valid JSON and has a @context. Exits non-zero on failure.
 *
 * Usage:
 *   node scripts/validate-jsonld.mjs [url1] [url2] ...
 *   JSONLD_URLS="https://a.com,https://b.com/page" node scripts/validate-jsonld.mjs
 *
 * Defaults to https://dotmail.lovable.app/ when no URLs are provided.
 */

const DEFAULT_URLS = ["https://dotmail.lovable.app/"];

function urlsFromArgs() {
  const cli = process.argv.slice(2).filter(Boolean);
  if (cli.length) return cli;
  const env = (process.env.JSONLD_URLS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (env.length) return env;
  return DEFAULT_URLS;
}

function extractJsonLdBlocks(html) {
  const re =
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const out = [];
  let m;
  while ((m = re.exec(html)) !== null) out.push(m[1].trim());
  return out;
}

async function validateUrl(url) {
  const res = await fetch(url, {
    headers: { "user-agent": "lovable-jsonld-validator/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const html = await res.text();
  const blocks = extractJsonLdBlocks(html);
  if (blocks.length === 0) {
    throw new Error("no JSON-LD blocks found");
  }

  const errors = [];
  blocks.forEach((raw, i) => {
    try {
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        if (!item || typeof item !== "object") {
          errors.push(`block #${i + 1}: not an object`);
          continue;
        }
        if (!item["@context"]) {
          errors.push(`block #${i + 1}: missing @context`);
        }
        if (!item["@type"] && !item["@graph"]) {
          errors.push(`block #${i + 1}: missing @type or @graph`);
        }
      }
    } catch (e) {
      errors.push(`block #${i + 1}: invalid JSON — ${e.message}`);
    }
  });

  return { url, count: blocks.length, errors };
}

const urls = urlsFromArgs();
let failed = false;

for (const url of urls) {
  process.stdout.write(`→ ${url}\n`);
  try {
    const { count, errors } = await validateUrl(url);
    if (errors.length) {
      failed = true;
      console.error(`  ✗ ${count} block(s), ${errors.length} error(s):`);
      for (const e of errors) console.error(`    - ${e}`);
    } else {
      console.log(`  ✓ ${count} JSON-LD block(s) valid`);
    }
  } catch (e) {
    failed = true;
    console.error(`  ✗ ${e.message}`);
  }
}

if (failed) {
  console.error("\nJSON-LD validation failed.");
  process.exit(1);
}
console.log("\nAll JSON-LD blocks valid.");
