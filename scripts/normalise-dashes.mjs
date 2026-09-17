#!/usr/bin/env node
// BUG-193 / CHG-109 / CHG-74: normalise em/en dashes in the lines the AGENT ADDED this run, before the
// CI rebuild + the seo-qa gate. Em dash -> spaced hyphen (" - "), en dash -> "-".
//
// WHY ADDED-LINES-ONLY: CHG-109 specified added-lines only, but the early inline version (RAIL_VERSION
// 2.5.1, King-Contractor-Agency/altusroofingmn#34) rewrote the WHOLE touched file, so a header comment
// carrying client-owned copy with an em-dash got silently edited and every diff carried unrelated churn.
// The agent owns the blog post it appends; the client owns the pre-existing copy. So we only ever touch
// the lines this run added:
//   - tracked file: the added-side line numbers of `git diff -U0 HEAD -- <file>` (a pure append never
//     includes a pre-existing line, so a header em-dash is left exactly as the client wrote it).
//   - untracked NEW file: the whole file (it is entirely the agent's, nothing pre-existing to protect).
//
// The seo-qa em-dash gate (seo-qa.mjs) is unchanged and independent: it bans em-dashes in the BUILT
// page's visible copy regardless of this step, so scoping the rewrite to added lines never weakens it.
//
// The pure functions are exported and unit-tested via `node scripts/normalise-dashes.mjs --selftest`
// (no git, no network - a fixture built from the Altus header). Run as main, it does the git plumbing.

import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, appendFileSync, rmSync } from "node:fs"
import { execFileSync } from "node:child_process"
import { pathToFileURL } from "node:url"
import { tmpdir } from "node:os"
import { join } from "node:path"

// Extensions the rail agent writes content into (mirror of the previous inline EXT_RE).
export const EXT_RE = /\.(js|jsx|ts|tsx|md|mdx|json|csv|html)$/

const EM_DASH = /[ \t]*—[ \t]*/g // em dash with any surrounding spaces/tabs -> a single spaced hyphen
const EN_DASH = /–/g // en dash -> plain hyphen

// Normalise one line's dashes. Pure; the exact port of the previous inline perl: an em dash with any
// surrounding spaces/tabs becomes " - ", an en dash becomes "-".
export function normaliseLine(line) {
  const out = line.replace(EM_DASH, " - ").replace(EN_DASH, "-")
  // BUG-193: an em-dash at end-of-line becomes " - " (a trailing space). If the original line (ignoring a
  // CRLF \r) had NO trailing whitespace, strip the space we introduced so a no-trailing-spaces lint on the
  // added line never trips. A line that legitimately ended in whitespace is left exactly as it was.
  return /[ \t]\r?$/.test(line) ? out : out.replace(/[ \t]+(\r?)$/, "$1")
}

/**
 * Normalise dashes in `text`, restricted to 1-based line numbers in `added` (a Set). Pass `added = null`
 * to normalise every line (a new untracked file). Line structure and endings are preserved (split/join
 * on "\n" leaves any trailing "\r" and the trailing newline intact).
 */
export function normaliseText(text, added) {
  const lines = text.split("\n")
  for (let i = 0; i < lines.length; i++) {
    if (added === null || added.has(i + 1)) lines[i] = normaliseLine(lines[i])
  }
  return lines.join("\n")
}

/**
 * The set of added-side (new-file) line numbers from `git diff -U0` output. Parses each hunk header
 * `@@ -a,b +c,d @@` and yields c .. c+d-1 (d defaults to 1 when omitted; d=0 is a pure deletion and
 * contributes nothing). Pure - the exact port of the previous inline perl hunk parser.
 */
export function parseAddedLines(diff) {
  const added = new Set()
  for (const line of diff.split("\n")) {
    const m = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/.exec(line)
    if (!m) continue
    const start = Number(m[1])
    const count = m[2] === undefined ? 1 : Number(m[2])
    for (let k = 0; k < count; k++) added.add(start + k)
  }
  return added
}

const git = (args) => execFileSync("git", args, { encoding: "utf8" })

/** Tracked files changed this run (added/copied/modified/renamed), filtered to content extensions. */
function trackedChangedFiles() {
  return git(["diff", "--name-only", "--diff-filter=ACMR", "HEAD"]).split("\n").filter((f) => f && EXT_RE.test(f))
}

/** Genuinely new (untracked, not ignored) files, filtered to content extensions. */
function untrackedNewFiles() {
  return git(["ls-files", "--others", "--exclude-standard"]).split("\n").filter((f) => f && EXT_RE.test(f))
}

function existsAsFile(path) {
  try { return readFileSync(path) && true } catch { return false }
}

/** Normalise `path` in place using `added` (null = whole file). Returns true if it changed. */
function normaliseFile(path, added) {
  const before = readFileSync(path, "utf8")
  const after = normaliseText(before, added)
  if (after === before) return false
  writeFileSync(path, after)
  return true
}

function run() {
  const touched = []
  for (const f of trackedChangedFiles()) {
    if (!existsAsFile(f)) continue // a deletion (D is filtered out already, but a rename edge could leave a gone path)
    const added = parseAddedLines(git(["diff", "-U0", "HEAD", "--", f]))
    if (added.size === 0) continue // nothing added in this tracked file (pure deletion / mode change)
    if (normaliseFile(f, added)) touched.push(f)
  }
  for (const f of untrackedNewFiles()) {
    if (!existsAsFile(f)) continue
    if (normaliseFile(f, null)) touched.push(f) // a brand-new file is entirely the agent's -> whole file
  }
  if (touched.length) console.log(`BUG-193/CHG-109: normalised dashes in agent-added lines:\n  ${touched.join("\n  ")}`)
  else console.log("BUG-193/CHG-109: no em/en dashes in agent-added lines.")
}

// --- selftest (pure; no git, no network) ---------------------------------------------------------
function selftest() {
  let fail = 0
  const ok = (c, m) => { if (!c) { console.log("FAIL " + m); fail++ } else console.log("PASS " + m) }

  // Line-level semantics: em dash (spaced or not) -> " - "; en dash -> "-"; both on one line; idempotent.
  ok(normaliseLine("PDFs — not AI") === "PDFs - not AI", "em dash with spaces -> spaced hyphen")
  ok(normaliseLine("a—b") === "a - b", "em dash without spaces -> spaced hyphen")
  ok(normaliseLine("2020–2021") === "2020-2021", "en dash -> plain hyphen")
  ok(normaliseLine("A — B — C") === "A - B - C", "multiple em dashes on one line all normalised")
  ok(normaliseLine("x — y – z") === "x - y - z", "em and en dash on one line")
  ok(normaliseLine(normaliseLine("a—b")) === normaliseLine("a—b"), "idempotent")
  ok(normaliseLine("plain hyphen - stays") === "plain hyphen - stays", "a real hyphen is untouched")

  // The Altus regression, exactly: header comments with em-dashes at lines 13-16, an appended post block
  // (lines 19-22) that also has em-dashes. Only the added lines may change.
  const header = [
    "// scheduled-posts.js", "// Auto-generated content configuration.", "// Do not hand-edit below the marker.",
    "//", "// line5", "// line6", "// line7", "// line8", "// line9", "// line10", "// line11", "// line12",
    "// Content is taken exactly from the PDFs — not AI-generated or rewritten.",
    "// Ownership — the client owns this copy.",
    "// Review — done by the agency.",
    "// Tone — factual, no rewriting.",
    "const posts = [];", "module.exports = { posts };",
  ]
  const appended = ['posts.push({', '  title: "Roof repair — fast",', '  body: "Call today — we answer.",', "});"]
  const full = [...header, ...appended].join("\n")
  const added = new Set([19, 20, 21, 22])
  const out = normaliseText(full, added).split("\n")
  ok(out[12] === "// Content is taken exactly from the PDFs — not AI-generated or rewritten.", "pre-existing header em-dash (line 13) left untouched")
  ok(out[13] === "// Ownership — the client owns this copy.", "pre-existing header em-dash (line 14) left untouched")
  ok(out[14] === "// Review — done by the agency.", "pre-existing header em-dash (line 15) left untouched")
  ok(out[15] === "// Tone — factual, no rewriting.", "pre-existing header em-dash (line 16) left untouched")
  ok(out[19] === '  title: "Roof repair - fast",', "added line (20) em-dash normalised")
  ok(out[20] === '  body: "Call today - we answer.",', "added line (21) em-dash normalised")

  // Line-structure / ending preservation.
  ok(normaliseText("a—b\r\nc—d\r\n", new Set([2])) === "a—b\r\nc - d\r\n", "CRLF preserved; only the added line (2) changed")
  ok(normaliseText("a—b\n", null).endsWith("\n"), "trailing newline preserved")
  ok(normaliseText("no dashes here", new Set([1])) === "no dashes here", "no-dash text unchanged")

  // Hunk parser: a pure append yields ONLY the appended lines; a modify hunk yields its new lines; a
  // pure deletion yields nothing; an omitted count means a single line.
  ok([...parseAddedLines("@@ -18,0 +19,4 @@ module.exports = { posts };")].sort((a, b) => a - b).join(",") === "19,20,21,22", "parse: pure append -> only added lines")
  ok([...parseAddedLines("@@ -13,4 +13,4 @@")].sort((a, b) => a - b).join(",") === "13,14,15,16", "parse: modify hunk -> its new lines")
  ok(parseAddedLines("@@ -13,3 +12,0 @@").size === 0, "parse: pure deletion (+c,0) -> no added lines")
  ok([...parseAddedLines("@@ -5 +7 @@")].join(",") === "7", "parse: omitted count -> single line")
  ok(parseAddedLines("not a hunk header\n+added but no header").size === 0, "parse: non-hunk lines ignored")
  ok([...parseAddedLines("@@ -1,0 +2,2 @@\nsome text\n@@ -10,0 +20,1 @@")].sort((a, b) => a - b).join(",") === "2,3,20", "parse: multi-hunk -> added lines from every hunk")

  // EXT_RE: content extensions only (the agent writes .js/.md/.csv/... ; a .py/.txt/binary is skipped).
  ok(EXT_RE.test("src/config/scheduled-posts.js") && EXT_RE.test("seo/worked-log.csv") && EXT_RE.test("post.md"), "EXT_RE matches content extensions")
  ok(!EXT_RE.test("script.py") && !EXT_RE.test("notes.txt") && !EXT_RE.test("logo.png"), "EXT_RE skips non-content extensions")

  // BUG-193 rec: a line ENDING in an em-dash used to leave a trailing space (a no-trailing-spaces lint on
  // the added line could then trip) - now FIXED (the introduced trailing space is stripped, CRLF-safe), and
  // a no-dash line's legitimate trailing whitespace is preserved. A line STARTING with an em-dash still
  // collapses its indent (rare; pinned + documented, not a regression).
  ok(normaliseLine("Ends here —") === "Ends here -", "fixed: a trailing em-dash no longer leaves a trailing space")
  ok(normaliseLine("Ends here —\r") === "Ends here -\r", "fixed: trailing em-dash under CRLF leaves no space before the \\r")
  ok(normaliseLine("legit trailing   ") === "legit trailing   ", "a no-dash line's legitimate trailing whitespace is preserved")
  ok(normaliseLine("  — starts here") === " - starts here", "known: a leading em-dash collapses the indent (perl-inherited)")

  // GIT PLUMBING end to end (run/trackedChangedFiles/parseAddedLines/normaliseFile) - the added-line
  // scoping this card exists for, which the pure cases above cannot reach. A committed file with a
  // pre-existing em-dash header + an appended em-dash line: run() must leave the header and touch only the
  // appended line (the exact Altus regression, through real git).
  {
    const repo = mkdtempSync(join(tmpdir(), "bug193-git-"))
    const sh = (a) => execFileSync("git", a, { cwd: repo, stdio: "pipe" })
    sh(["init", "-q"]); sh(["config", "user.email", "t@t.co"]); sh(["config", "user.name", "t"])
    const rel = "src/config/scheduled-posts.js"
    mkdirSync(join(repo, "src/config"), { recursive: true })
    writeFileSync(join(repo, rel), "// Content is taken exactly from the PDFs — not AI-generated.\nexport const posts = [];\n")
    sh(["add", "-A"]); sh(["commit", "-qm", "base"])
    appendFileSync(join(repo, rel), 'posts.push({ title: "Roof repair — fast" });\n')
    const cwd0 = process.cwd()
    try { process.chdir(repo); run() } finally { process.chdir(cwd0) }
    const after = readFileSync(join(repo, rel), "utf8")
    ok(after.includes("from the PDFs — not AI-generated"), "git plumbing: pre-existing header em-dash SURVIVES untouched")
    ok(after.includes('title: "Roof repair - fast"') && !after.includes("Roof repair — fast"), "git plumbing: the appended line's em-dash IS normalised")
    rmSync(repo, { recursive: true, force: true })
  }

  // GIT PLUMBING, untracked NEW file: entirely the agent's -> whole file normalised (added === null path).
  {
    const repo = mkdtempSync(join(tmpdir(), "bug193-git2-"))
    const sh = (a) => execFileSync("git", a, { cwd: repo, stdio: "pipe" })
    sh(["init", "-q"]); sh(["config", "user.email", "t@t.co"]); sh(["config", "user.name", "t"])
    writeFileSync(join(repo, "README.md"), "# base\n"); sh(["add", "-A"]); sh(["commit", "-qm", "base"])
    writeFileSync(join(repo, "new-post.js"), 'const t = "New — post";\nconst u = "and — more";\n')
    const cwd0 = process.cwd()
    try { process.chdir(repo); run() } finally { process.chdir(cwd0) }
    ok(!readFileSync(join(repo, "new-post.js"), "utf8").includes("—"), "git plumbing: a brand-new untracked file is whole-file normalised")
    rmSync(repo, { recursive: true, force: true })
  }

  console.log(fail === 0 ? "\nnormalise-dashes selftest: OK" : `\nnormalise-dashes selftest: ${fail} FAILURE(S)`)
  process.exit(fail === 0 ? 0 : 1)
}

// Run-as-main guard (COA-07 pattern): importing this module exposes the pure functions without side
// effects; only a direct invocation runs the git plumbing or the selftest.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes("--selftest")) selftest()
  else run()
}
