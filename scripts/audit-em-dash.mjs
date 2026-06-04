#!/usr/bin/env node
/**
 * Audit em dash (—, U+2014) in user-facing files.
 * Strips // and /* * / comments before scanning so dev notes don't false-fail.
 * Exit 1 if any em dash remains in shipped strings / markup / public assets.
 */
import { readFileSync, statSync, readdirSync } from "node:fs";
import { join, extname, relative } from "node:path";

const ROOTS = ["src", "public"];
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".html", ".txt", ".md", ".json"]);
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".output", ".nitro"]);
const SKIP_FILES = new Set([
  "src/routeTree.gen.ts",
  "src/routes/README.md",
  "src/lib/config.server.ts",
  "src/server.ts",
  "src/styles.css",
  "scripts/audit-em-dash.mjs",
]);

const EM_DASH = "\u2014";

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (SKIP_DIRS.has(entry)) continue;
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (EXTS.has(extname(p))) out.push(p);
  }
  return out;
}

function stripComments(src, ext) {
  if (ext === ".md" || ext === ".txt" || ext === ".json") return src;
  // remove /* ... */ block comments
  let s = src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
  // remove // line comments (naive but good enough; URLs in strings stay)
  s = s
    .split("\n")
    .map((line) => {
      const idx = line.indexOf("//");
      if (idx === -1) return line;
      // ignore // inside a string literal on the same line (very naive)
      const before = line.slice(0, idx);
      const quotes = (before.match(/["'`]/g) || []).length;
      if (quotes % 2 === 1) return line;
      return before;
    })
    .join("\n");
  return s;
}

const hits = [];
for (const root of ROOTS) {
  try {
    statSync(root);
  } catch {
    continue;
  }
  for (const file of walk(root)) {
    const rel = relative(process.cwd(), file).replaceAll("\\", "/");
    if (SKIP_FILES.has(rel)) continue;
    const raw = readFileSync(file, "utf8");
    if (!raw.includes(EM_DASH)) continue;
    const cleaned = stripComments(raw, extname(file));
    cleaned.split("\n").forEach((line, i) => {
      if (line.includes(EM_DASH)) hits.push(`${rel}:${i + 1}: ${line.trim()}`);
    });
  }
}

if (hits.length) {
  console.error(`✖ Found ${hits.length} em dash occurrence(s) in user-facing content:\n`);
  for (const h of hits) console.error("  " + h);
  console.error('\nReplace "\\u2014" with "-", "|", or rewrite the sentence.');
  process.exit(1);
}
console.log("✓ No em dash found in user-facing files.");
