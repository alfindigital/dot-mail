#!/usr/bin/env node
/**
 * Fetches a deployed URL and validates that every <script type="application/ld+json">
 * block parses as valid JSON and has a @context. Exits non-zero on failure.
 *
 * Usage:
 *   node scripts/validate-jsonld.mjs [url1] [url2] ...
 *   JSONLD_URLS="https://a.com,https://b.com/page" node scripts/validate-jsonld.mjs
 *
 * Export machine-readable report (great for CI artifacts):
 *   node scripts/validate-jsonld.mjs --out=report.json https://site.com/
 *   JSONLD_OUT=report.json node scripts/validate-jsonld.mjs
 *
 * Defaults to https://dotmail.lovable.app/ when no URLs are provided.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const DEFAULT_URLS = ["https://dotmail.lovable.app/"];

function parseArgs() {
  const cli = process.argv.slice(2).filter(Boolean);
  let out = process.env.JSONLD_OUT || "";
  const urls = [];
  for (const a of cli) {
    if (a.startsWith("--out=")) out = a.slice("--out=".length);
    else if (a === "--out") out = "__NEXT__";
    else if (out === "__NEXT__") out = a;
    else urls.push(a);
  }
  if (!urls.length) {
    const env = (process.env.JSONLD_URLS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (env.length) urls.push(...env);
  }
  return { urls: urls.length ? urls : DEFAULT_URLS, out };
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

function collectTypes(parsed) {
  const items = Array.isArray(parsed) ? parsed : [parsed];
  const types = [];
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    if (item["@type"]) types.push(item["@type"]);
    if (Array.isArray(item["@graph"])) {
      for (const n of item["@graph"]) if (n?.["@type"]) types.push(n["@type"]);
    }
  }
  return types;
}

function snippet(raw, max = 240) {
  const clean = raw.replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max) + "…" : clean;
}

async function validateUrl(url) {
  const res = await fetch(url, {
    headers: { "user-agent": "lovable-jsonld-validator/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const html = await res.text();
  const blocks = extractJsonLdBlocks(html);
  if (blocks.length === 0) throw new Error("no JSON-LD blocks found");

  const summaries = [];
  const scripts = [];
  const errors = [];

  blocks.forEach((raw, i) => {
    const idx = i + 1;
    const entry = {
      index: idx,
      status: "OK",
      parseOk: false,
      name: "(unknown)",
      types: [],
      bytes: raw.length,
      rawSnippet: snippet(raw),
      raw,
      errors: [],
    };
    try {
      const parsed = JSON.parse(raw);
      entry.parseOk = true;
      entry.types = collectTypes(parsed);
      entry.name = inferName(Array.isArray(parsed) ? parsed[0] : parsed);

      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        if (!item || typeof item !== "object") {
          entry.errors.push("not an object");
        } else {
          if (!item["@context"]) entry.errors.push("missing @context");
          if (!item["@type"] && !item["@graph"])
            entry.errors.push("missing @type or @graph");
        }
      }
    } catch (e) {
      entry.errors.push(`invalid JSON — ${e.message}`);
      entry.name = "(invalid JSON)";
    }

    if (entry.errors.length) entry.status = "FAIL";

    scripts.push(entry);
    summaries.push({ idx, name: entry.name, status: entry.status });
    for (const err of entry.errors) errors.push(`block #${idx}: ${err}`);
  });

  return { url, count: blocks.length, summaries, scripts, errors };
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

const { urls, out } = parseArgs();
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
    results.push({
      url,
      count: 0,
      summaries: [],
      scripts: [],
      errors: [e.message],
      fetchError: e.message,
    });
  }
}

const totalBlocks = results.reduce((a, r) => a + r.count, 0);
const totalErrors = results.reduce((a, r) => a + r.errors.length, 0);

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(
  `Grand total: ${totalBlocks} block(s) across ${urls.length} URL(s), ${totalErrors} error(s).`,
);

if (out) {
  const report = {
    generatedAt: new Date().toISOString(),
    tool: "lovable-jsonld-validator/1.0",
    status: failed ? "fail" : "pass",
    totals: {
      urls: urls.length,
      blocks: totalBlocks,
      errors: totalErrors,
    },
    results,
  };
  const outPath = resolve(process.cwd(), out);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");
  console.log(`Report written to ${outPath}`);
}

if (failed) {
  console.error(`\nJSON-LD validation FAILED.`);
  process.exit(1);
}
console.log(`\nAll JSON-LD blocks valid.`);
