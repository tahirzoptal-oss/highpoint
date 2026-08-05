# On-page SEO standard (QA)

The checklist the agent must satisfy and the QA gate confirms. Adjust per site in
the site-adapter's "Hard limits"; these are the defaults.

## Hard stops (QA must fail the build)
- Exactly one `<h1>` per page.
- `<title>` unique across the site; meta description unique across the site.
- `metaTitle` <= 60 characters.
- No "near me" in a service page's title or H1.
- No phone number in the title.
- All internal links resolve to a built path (no broken links).
- All JSON-LD parses.

## Warnings (allowed, flag in the summary)
- Title > 60 chars; meta description outside 140-165 chars; missing canonical.

## Structure
- Answer-first opening; primary keyword in the first 100 words.
- 3-5 H2 sections; a bulleted service/benefit list where it fits.
- 3-5 internal links to related/adjacent pages that already exist.
- Body length per the brief (typically 400-800 words).

## Schema
- Emit the page's type schema + BreadcrumbList. Add FAQPage only when the template
  wires it (note any gap in the PR).
