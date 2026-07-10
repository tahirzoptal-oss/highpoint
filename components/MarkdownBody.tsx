import type { ReactNode } from "react"

/**
 * Lightweight markdown renderer for the per-client page bodies the copy pipeline
 * produces (Stage 6 copy-deck -> bridge). Handles the subset the copy deck uses:
 * `## H2`, paragraphs, `- ` bullet lists, `**bold**`, `*italic*`, and the
 * `<!-- SUBSERVICE_START: Title -->` / `<!-- SUBSERVICE_END -->` zone markers.
 * No external dependency, no raw HTML injection.
 */

function renderInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = []
  // Split on **bold** and *italic* while keeping delimiters.
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  parts.forEach((part, i) => {
    if (!part) return
    if (part.startsWith("**") && part.endsWith("**")) {
      nodes.push(<strong key={`${keyBase}-${i}`} className="font-bold text-foreground">{part.slice(2, -2)}</strong>)
    } else if (part.startsWith("*") && part.endsWith("*")) {
      nodes.push(<em key={`${keyBase}-${i}`} className="italic">{part.slice(1, -1)}</em>)
    } else {
      nodes.push(part)
    }
  })
  return nodes
}

export function MarkdownBody({ markdown }: { markdown: string }) {
  if (!markdown || !markdown.trim()) return null
  const lines = markdown.replace(/\r\n/g, "\n").split("\n")
  const blocks: ReactNode[] = []
  let listBuf: string[] = []
  let paraBuf: string[] = []
  let key = 0

  const flushList = () => {
    if (!listBuf.length) return
    const items = [...listBuf]
    listBuf = []
    blocks.push(
      <ul key={`ul-${key++}`} className="my-5 space-y-2 list-disc pl-6 text-muted">
        {items.map((it, i) => (
          <li key={i} className="leading-relaxed">{renderInline(it, `li-${key}-${i}`)}</li>
        ))}
      </ul>
    )
  }
  const flushPara = () => {
    if (!paraBuf.length) return
    const text = paraBuf.join(" ").trim()
    paraBuf = []
    if (text) blocks.push(<p key={`p-${key++}`} className="my-4 leading-relaxed text-muted text-lg">{renderInline(text, `p-${key}`)}</p>)
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (line === "") { flushPara(); flushList(); continue }
    const sub = line.match(/^<!--\s*SUBSERVICE_START:\s*(.+?)\s*-->$/)
    if (sub) {
      flushPara(); flushList()
      blocks.push(
        <div key={`sub-${key++}`} className="mt-12 mb-2 border-t border-accent/30 pt-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{sub[1]}</p>
        </div>
      )
      continue
    }
    if (/^<!--\s*SUBSERVICE_END\s*-->$/.test(line)) { flushPara(); flushList(); continue }
    if (line.startsWith("## ")) {
      flushPara(); flushList()
      blocks.push(<h2 key={`h2-${key++}`} className="mt-10 mb-4 text-2xl md:text-3xl font-bold font-heading text-foreground">{renderInline(line.slice(3), `h2-${key}`)}</h2>)
      continue
    }
    if (line.startsWith("### ")) {
      flushPara(); flushList()
      blocks.push(<h3 key={`h3-${key++}`} className="mt-8 mb-3 text-xl font-bold font-heading text-foreground">{renderInline(line.slice(4), `h3-${key}`)}</h3>)
      continue
    }
    if (line.startsWith("- ")) { flushPara(); listBuf.push(line.slice(2)); continue }
    paraBuf.push(line)
  }
  flushPara(); flushList()

  return <div className="max-w-3xl">{blocks}</div>
}
