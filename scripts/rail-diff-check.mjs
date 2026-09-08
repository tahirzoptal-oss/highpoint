#!/usr/bin/env node
// BUG-152: the rail's PR body was written from the agent's PLAN, not the diff it produced. On OSAAT
// #23 the body claimed a src/config/route-metas.js edit that was NOT in the PR: the agent wrote the
// file, but peter-evans/create-pull-request commits ONLY the `add-paths` allowlist, so an edit to a
// file outside that allowlist is SILENTLY DROPPED while the plan-derived body still claims it. The
// page then shipped the homepage description and every gate said fine.
//
// This runs after the agent, before the PR opens. It:
//   1. FAILS THE RUN when the agent changed a file OUTSIDE the commit allowlist (the silent drop),
//      so the drop surfaces as a visible error instead of a green PR that under-delivers.
//   2. Writes the authoritative "Files changed" section into seo-run-summary.md FROM THE ACTUAL
//      working tree (what will be committed), so the PR body lists exactly the files in its diff.
//
// The allowlist is read from seo/content-allowlist.txt (the installer writes it from the SAME
// content-allowlist that fills the workflow's add-paths, so the two cannot drift). Pure helpers are
// exported and exercised by --selftest (and a dashboard test); the module is side-effect-free on
// import (the CLI guard at the bottom).
//
// BUG-171: the agent runs the site's build during its step, and a Main-factory prebuild
// (inject-theme.mjs) REGENERATES index.html + src/index.css IN THE SOURCE TREE from brand-dna. Those
// derived files are dirty when this runs but are NOT agent edits - they were being reported as silent
// drops, failing 3 of 8 Monday runs. So build-regenerated files are excluded from the drop check: a
// built-in default (index.html, src/index.css) plus whatever seo/generated-paths.txt declares.

import { readFile, writeFile } from "node:fs/promises"
import { execSync } from "node:child_process"
import { resolve, dirname } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const ALLOWLIST_FILE = resolve(ROOT, "seo/content-allowlist.txt")
const GENERATED_PATHS_FILE = resolve(ROOT, "seo/generated-paths.txt")
const SUMMARY_FILE = resolve(ROOT, "seo-run-summary.md")

// Uncommitted-by-design or build output: never a "silent drop", never listed as a changed file.
const IGNORE_PREFIXES = ["dist/", "build/", ".next/", "node_modules/", "coverage/", "out/"]
const IGNORE_EXACT = new Set(["seo-run-summary.md"])
// BUG-171: the standard Main-factory in-tree build outputs, excluded even before a rail declares its
// own seo/generated-paths.txt. Safe because the agent is add-only content and never hand-edits these
// (that is the dashboard edit engine's job - an edit here is a misrouted brief the earlier gates catch).
const DEFAULT_GENERATED = ["index.html", "src/index.css"]
const SECTION_HEADING = "## Files changed (from the diff)"

/** Parse an allowlist file: one path/glob per line; blank lines and `#` comments ignored. */
export function parseAllowlist(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
}

/**
 * BUG-171: is `path` build output we ignore entirely (never a drop, never a changed file)? Matches a
 * file UNDER a build dir (`dist/index.html`) AND the bare directory name itself - git reports an
 * untracked build dir as a single entry `dist` (porcelain `?? dist`), which `dist/`-prefix matching
 * missed, so Camelback's bare `dist` was wrongly flagged as a dropped edit.
 */
export function isBuildOutputPath(path) {
  const p = String(path || "")
  if (IGNORE_EXACT.has(p)) return true
  return IGNORE_PREFIXES.some((pre) => p === pre.replace(/\/+$/, "") || p.startsWith(pre))
}

/** A pathspec/gitignore-ish glob to an anchored RegExp: `**` -> any, `*` -> one segment. */
function globToRegExp(glob) {
  let re = ""
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i]
    if (c === "*") {
      if (glob[i + 1] === "*") { re += ".*"; i++; if (glob[i + 1] === "/") i++ }
      else re += "[^/]*"
    } else if ("\\^$.|?+()[]{}".includes(c)) {
      re += "\\" + c
    } else {
      re += c
    }
  }
  return new RegExp("^" + re + "$")
}

/** True when `path` is covered by any allowlist pattern (exact, directory prefix, or glob). */
export function matchesAllowlist(path, patterns) {
  const p = String(path || "").replace(/^\.\//, "")
  for (const raw of patterns) {
    const pat = String(raw || "").replace(/^\.\//, "").replace(/\/+$/, "")
    if (!pat) continue
    if (p === pat) return true
    if (p.startsWith(pat + "/")) return true // a bare directory covers everything under it
    if (/[*?[]/.test(pat) && globToRegExp(pat).test(p)) return true
  }
  return false
}

/** Merge the built-in generated defaults with a rail's declared seo/generated-paths.txt patterns. */
export function resolveGeneratedPatterns(declaredText) {
  return [...new Set([...DEFAULT_GENERATED, ...parseAllowlist(declaredText)])]
}

/**
 * Split changed paths into what WILL commit (allowlisted) vs what would silently drop. `generated`
 * (BUG-171) is the set the BUILD regenerates in-tree: a non-allowlisted file that matches it is
 * neither committed nor a drop - it is derived build output, not an agent edit.
 */
export function partitionChanges(changed, patterns, generated = []) {
  const committed = new Set()
  const dropped = new Set()
  for (const f of changed) {
    if (isBuildOutputPath(f)) continue // dist/, a bare `dist`, seo-run-summary.md (BUG-171)
    if (matchesAllowlist(f, patterns)) { committed.add(f); continue } // an allowlisted file commits (peter-evans)
    if (generated.length && matchesAllowlist(f, generated)) continue   // BUG-171: build-regenerated, not an agent drop
    dropped.add(f)
  }
  return { committed: [...committed].sort(), dropped: [...dropped].sort() }
}

/** The authoritative Files-changed markdown section, derived from the committed set. */
export function filesChangedSection(committed) {
  const body = committed.length ? committed.map((f) => `- \`${f}\``).join("\n") : "- (no source files changed this run)"
  return `${SECTION_HEADING}\n${body}\n`
}

/** Replace any prior Files-changed section then append the fresh one (idempotent across reruns). */
export function withFilesChanged(summary, committed) {
  const headingRe = SECTION_HEADING.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // the heading has literal ()
  const stripped = String(summary || "").replace(new RegExp(`\\n*${headingRe}[\\s\\S]*$`), "")
  return `${stripped.trimEnd()}\n\n${filesChangedSection(committed)}`
}

/** The agent's changed files from the working tree (uncommitted at this point). */
function gitChangedFiles() {
  let out = ""
  try { out = execSync("git status --porcelain", { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }) } catch { return [] }
  const files = []
  for (const line of out.split(/\r?\n/)) {
    if (!line.trim()) continue
    let p = line.slice(3)
    if (line[0] === "R" || line[1] === "R") { const a = p.indexOf(" -> "); if (a !== -1) p = p.slice(a + 4) }
    p = p.replace(/^"(.*)"$/, "$1")
    files.push(p)
  }
  return files
}

async function main() {
  const patterns = parseAllowlist(await readFile(ALLOWLIST_FILE, "utf8").catch(() => ""))
  if (patterns.length === 0) {
    console.error(`rail-diff-check: ${ALLOWLIST_FILE} is missing or empty; cannot verify the diff against the commit allowlist.`)
    process.exit(1)
  }
  // BUG-171: exclude files the build regenerates in-tree (default + the rail's declared list) so a
  // prebuild-rewritten index.html / src/index.css is not mistaken for a dropped agent edit.
  const generated = resolveGeneratedPatterns(await readFile(GENERATED_PATHS_FILE, "utf8").catch(() => ""))
  const { committed, dropped } = partitionChanges(gitChangedFiles(), patterns, generated)

  if (dropped.length > 0) {
    console.error("rail-diff-check: the agent changed file(s) OUTSIDE the commit allowlist. peter-evans/create-pull-request")
    console.error("commits only the allowlisted paths, so these edits would be SILENTLY DROPPED while the PR body claims them:")
    for (const f of dropped) console.error("  DROPPED  " + f)
    console.error("Fix: add the file (e.g. its companion src/config/route-metas.js) to the site-adapter content allowlist so")
    console.error("the edit actually commits, or route the change to the dashboard edit engine. Failing the run (BUG-152).")
    console.error("(If a file here is BUILD OUTPUT the prebuild regenerates, add it to seo/generated-paths.txt instead - BUG-171.)")
    process.exit(1)
  }

  const summary = await readFile(SUMMARY_FILE, "utf8").catch(() => "")
  await writeFile(SUMMARY_FILE, withFilesChanged(summary, committed))
  console.log(`rail-diff-check: ${committed.length} file(s) will commit, 0 silent drops.`)
}

function selftest() {
  const ok = (c, m) => { if (!c) { console.error("selftest FAIL: " + m); process.exit(1) } }
  const patterns = parseAllowlist("# content\nsrc/config/brand-dna.js\nsrc/data/**\n\nseo/worked-log.csv\n")
  ok(patterns.length === 3, "parseAllowlist drops comments/blanks")
  ok(matchesAllowlist("src/config/brand-dna.js", patterns), "exact match")
  ok(matchesAllowlist("src/data/reviews/x.js", patterns), "dir-glob match")
  ok(matchesAllowlist("seo/worked-log.csv", patterns), "worked-log allowlisted")
  ok(!matchesAllowlist("src/config/route-metas.js", patterns), "route-metas NOT allowlisted (the OSAAT drop)")
  // The OSAAT case: the agent wrote route-metas.js (not allowlisted) -> a silent drop.
  const changed = ["src/config/brand-dna.js", "src/config/route-metas.js", "seo/worked-log.csv", "seo-run-summary.md", "dist/index.html"]
  const { committed, dropped } = partitionChanges(changed, patterns)
  ok(dropped.length === 1 && dropped[0] === "src/config/route-metas.js", "route-metas.js is the silent drop")
  ok(committed.join(",") === "seo/worked-log.csv,src/config/brand-dna.js", "committed = allowlisted only; summary/dist excluded")
  // BUG-171: the prebuild regenerates index.html + src/index.css in-tree; the default generated set
  // excludes them, so they are NOT reported as dropped, while a real non-allowlisted edit still is.
  const generated = resolveGeneratedPatterns("")
  ok(generated.includes("index.html") && generated.includes("src/index.css"), "default generated set covers the Main-factory outputs")
  const withBuild = ["src/config/brand-dna.js", "index.html", "src/index.css", "src/config/route-metas.js"]
  const p2 = partitionChanges(withBuild, patterns, generated)
  ok(p2.dropped.length === 1 && p2.dropped[0] === "src/config/route-metas.js", "BUG-171: build output excluded, real drop still caught")
  ok(!p2.committed.includes("index.html") && !p2.committed.includes("src/index.css"), "build output is never committed either")
  // BUG-171: Altus declares public/sitemap.xml (its generate-sitemap output) in seo/generated-paths.txt.
  const gen2 = resolveGeneratedPatterns("# gen\npublic/sitemap.xml\n")
  ok(gen2.includes("public/sitemap.xml") && gen2.includes("index.html"), "declared generated paths merge with the default")
  ok(partitionChanges(["public/sitemap.xml"], patterns, gen2).dropped.length === 0, "Altus public/sitemap.xml is not a drop")
  // BUG-171: Camelback's bare untracked `dist` (porcelain `?? dist`) is build output, never a drop.
  ok(isBuildOutputPath("dist") && isBuildOutputPath("dist/index.html"), "a bare `dist` and dist/ are both build output")
  ok(partitionChanges(["dist", "src/config/route-metas.js"], patterns, generated).dropped.join(",") === "src/config/route-metas.js", "bare dist excluded; the real drop remains")
  // Body reflects exactly the committed diff, idempotently.
  const once = withFilesChanged("A run summary.", committed)
  ok(once.includes("`src/config/brand-dna.js`") && once.includes("`seo/worked-log.csv`"), "body lists the committed files")
  ok(!once.includes("route-metas"), "body never lists a dropped file")
  const twice = withFilesChanged(once, committed)
  ok((twice.match(/Files changed \(from the diff\)/g) || []).length === 1, "Files-changed section is idempotent")
  console.log("selftest OK")
}

// Only run when invoked directly (node scripts/rail-diff-check.mjs [--selftest]); importing is inert.
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  if (process.argv.includes("--selftest")) selftest()
  else main()
}
