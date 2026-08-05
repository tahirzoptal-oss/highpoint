# Build Brief — <Page title>

<!--
CANONICAL BRIEF TEMPLATE. Every brief the brain-feeder drafts must follow this
shape. The `engine` field is REQUIRED and decides routing (COA-00 engine-split):
  - engine: rail   -> appends a NEW instance to an existing content array (this
                      rail builds ONLY these).
  - engine: edit   -> modifies a file that already exists (goes to the dashboard
                      edit engine, NOT the rail).
  - engine: scaffold -> needs a new route/template/component (human task first).
The rail hard-fails any brief whose engine is not `rail` / is not add-only.
Routing is decided at brief time by the brain-feeder + Mark, never at run time.
-->

- **engine:** rail
- **page type:** <service | location | blog>
- **slug:** <kebab-case-unique>
- **url:** </route/:slug>
- **priority:** <P1 | P2 | P3>
- **status:** ready-to-build

## Why this page (GSC evidence)
<query | position | impressions — the live numbers that justify the page>

## Cluster
- **Primary:** <keyword>
- **Secondary:** <up to 4 supporting keywords>
- **Intent:** <commercial / informational / ...>

## SERP target
<word count, H2 count, internal links per the site-adapter + on-page-seo.md>

## Real local detail *(draft — verify before merge)*
<grounded neighborhood/business detail; facts ONLY from voice.md's allowlist +
the numbers above; flag anything to confirm>

## Exact edits (add-only)
Append ONE new instance to `<content array from the site-adapter>` with the field
shapes the adapter specifies. Never edit an existing slug.

## Acceptance
<metaTitle <=60, unique title/description, one H1, primary kw in first 100 words,
internal links resolve, build + QA (seo-qa) exit 0>
