# On-page SEO standard (QA)

The checklist the agent must satisfy and the QA gate confirms. Adjust per site in
the site-adapter's "Hard limits"; these are the defaults. The numbers below are the
ruled hard limits (SEO Agent Enforcement Brief 2.2, locked Mark + Juan 2026-08-06);
`scripts/seo-qa.mjs` enforces exactly these, so declared equals enforced.

## Hard stops (QA fails the build)
- Exactly one `<h1>` per page.
- `<title>` unique across the site; meta description unique across the site.
- `metaTitle` present, and 60 characters or fewer. Missing title = fail; over 60 = fail.
- Meta description present, and 160 characters or fewer. Missing = fail; over 160 = fail.
- No phone number in the `metaTitle` or the meta description.
- No "near me" in a service page title or a service-area page title.
- The `<h1>` must not duplicate the title (token overlap of 0.80 or more = fail).
- Schema present per page type: a service page needs Service + BreadcrumbList; a
  service-area (city) page needs BreadcrumbList; a blog post needs Article (or
  BlogPosting). A page of one of these types with zero schema fails.
- All internal links resolve to a built path (no broken links).
- All JSON-LD parses.
- No em-dashes in the page copy (CHG-74; use a hyphen or restructure the sentence).
  The QA gate HARD-FAILS your build if one appears on a page you wrote - a claim of
  compliance does not pass the gate, only the absence of the character does. MANDATORY
  final step before you finish: search every file you created or edited for the
  character "—" (for example `grep -rn — <your changed files>`) and remove every
  occurrence. Do not rely on memory or on having "written carefully" - run the search.

## Warnings (allowed, flag in the summary)
- Meta description under 150 characters (target 150 to 155).
- Missing canonical.

## Structure
- Answer-first opening; primary keyword in the first 100 words.
- 3-5 H2 sections; a bulleted service/benefit list where it fits.
- 3-5 IN-COPY internal links with descriptive anchor text (woven into the body prose,
  not just a template city/service grid) to related/adjacent pages that already exist.
- Body length per the brief (typically 400-800 words).

## Advertise the page you build (BUG-70)
Building a location/service-area page is not done until the site actually links to it.
- **Append to the array that RENDERS, not just the data array.** If a component picks
  a curated list over the raw one (`const areas = X.display* || X.dataArray`), the
  bullets read the `display*` array - appending to the data array leaves the page
  built but unadvertised. Use the array the site-adapter names as the render target.
- **Insert before any sentinel entry.** If the rendered list ends with a literal
  "& More" / "And More" item, the new entry goes BEFORE it, never after.
- **Match the existing casing.** If entries are Title Case ("Winter Park"), match it;
  a link lookup that lowercases the name will not resolve a case-mismatched bullet.
- **Add the link entry too.** If a separate array maps a displayed name to its URL
  (e.g. `location_pages`), add the new city there as well, or the bullet renders but
  does not link to the page you just built.

## Schema
- Emit the page's type schema + BreadcrumbList (required, see Hard stops). Add FAQPage
  when the template wires it, mirroring the rendered FAQ exactly (note any gap in the PR).
