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

function inferName(item) {
  if (!item || typeof item !== "object") return "(unknown)";
  if (item["@graph"] && Array.isArray(item["@graph"])) {
    const types = item["@graph"]
      .map((n) => n?.["@type"])
      .filter(Boolean)
      .join(", ");
    return `@graph → ${types || "(unknown)"}`;
  }
  if (Array.isArray(item)) {
    const types = item.map((n) => n?.["@type"]).filter(Boolean).join(", ");
    return `[array] → ${types || "(unknown)"}`;
  }
  return item["@type"] || item.name || "(unknown)";
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

  const summaries = [];
  const errors = [];
  blocks.forEach((raw, i) => {
    const idx = i + 1;
    try {
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        if (!item || typeof item !== "object") {
          summaries.push({ idx, name: "(invalid)", status: "FAIL" });
          errors.push(`block #${idx}: not an object`);
          continue;
        }
        if (!item["@context"]) {
          summaries.push({ idx, name: inferName(item), status: "FAIL" });
          errors.push(`block #${idx}: missing @context`);
          continue;
        }
        if (!item["@type"] && !item["@graph"]) {
          summaries.push({ idx, name: inferName(item), status: "FAIL" });
          errors.push(`block #${idx}: missing @type or @graph`);
          continue;
        }
        summaries.push({ idx, name: inferName(item), status: "OK" });
      }
    } catch (e) {
      summaries.push({ idx, name: "(invalid JSON)", status: "FAIL" });
      errors.push(`block #${idx}: invalid JSON — ${e.message}`);
    }
  });

  return { url, count: blocks.length, summaries, errors };
}

function printSummary(result) {
  const { url, count, summaries, errors } = result;
  const okCount = summaries.filter((s) => s.status === "OK").length;
  const failCount = summaries.filter((s) => s.status === "FAIL").length;

  console.log(`\n  ╔══════════════════════════════════════════════════════╗`);
  console.log(`  ║  JSON-LD Validation Summary                          ║`);
  console.log(`  ╠══════════════════════════════════════════════════════╣`);
  console.log(`  ║  URL:     ${url.slice(0, 48).padEnd(48)} ║`);
  console.log(`  ║  Blocks:  ${String(count).padEnd(48)} ║`);
  console.log(`  ║  Valid:   ${String(okCount).padEnd(48)} ║`);
  console.log(`  ║  Invalid: ${String(failCount).padEnd(48)} ║`);
  console.log(`  ╠══════════════════════════════════════════════════════╣`);

  if (summaries.length) {
    console.log(`  ║  #   Status  Name                                   ║`);
    console.log(`  ╠══════════════════════════════════════════════════════╣`);
    for (const s of summaries) {
      const status = s.status === "OK" ? "✓ OK   " : "✗ FAIL ";
      const name = s.name.slice(0, 38).padEnd(38);
      console.log(`  ║  ${String(s.idx).padEnd(3)} ${status} ${name} ║`);
    }
  }

  if (errors.length) {
    console.log(`  ╠══════════════════════════════════════════════════════╣`);
    console.log(`  ║  Errors:                                             ║`);
    for (const e of errors) {
      const line = `  • ${e}`.slice(0, 50).padEnd(50);
      console.log(`  ║  ${line} ║`);
    }
  }
  console.log(`  ╚══════════════════════════════════════════════════════╝`);
}

const urls = urlsFromArgs();
let failed = false;
const results = [];

for (const url of urls) {
  console.log(`\n→ ${url}`);
  try {
    const result = await validateUrl(url);
    results.push(result);
    printSummary(result);
    if (result.errors.length) failed = true;
  } catch (e) {
    failed = true;
    console.error(`  ✗ ${e.message}`);
    results.push({ url, count: 0, summaries: [], errors: [e.message] });
  }
}

const totalBlocks = results.reduce((a, r) => a + r.count, 0);
const totalErrors = results.reduce((a, r) => a + r.errors.length, 0);

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`Grand total: ${totalBlocks} block(s) across ${urls.length} URL(s), ${totalErrors} error(s).`);

if (failed) {
  console.error(`\nJSON-LD validation FAILED.`);
  process.exit(1);
}
console.log(`\nAll JSON-LD blocks valid.`);
