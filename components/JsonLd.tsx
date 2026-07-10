/**
 * Renders a JSON-LD structured-data block. Server component, safe under static
 * export. Pass any schema.org object (or null to render nothing).
 *
 * The JSON is rendered as escaped script text (no raw HTML injection): "<", ">"
 * and "&" are unicode-escaped, which keeps the JSON valid while making a
 * "</script>" breakout impossible.
 */
export function JsonLd({ data }: { data: unknown }) {
  if (!data) return null
  const json = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
  return (
    <script type="application/ld+json" suppressHydrationWarning>
      {json}
    </script>
  )
}
