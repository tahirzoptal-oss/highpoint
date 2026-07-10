import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { IconChip } from "@/components/IconChip"
import { resolveServiceIcon } from "@/lib/icon-map"

interface ServiceCardProps {
  title: string
  description: string
  href: string
  icon: string
}

export function ServiceCard({ title, description, href, icon }: ServiceCardProps) {
  return (
    <Link href={href} className="group block">
      {/* B3: light-band card depth comes from the shared .hover-card tokens
       * (two-layer --shadow-card + asymmetric lift), not hand-rolled shadows. */}
      <div className="hover-card rounded-[var(--radius-lg)] border border-border bg-card p-6 md:p-8">
        <IconChip
          name={resolveServiceIcon(title, icon)}
          surface="light"
          size={48}
          className="mb-4"
        />

        <h3 className="text-xl font-bold font-heading text-foreground mb-2">
          {title}
        </h3>

        <p className="text-muted leading-relaxed mb-4">{description}</p>

        <span className="inline-flex items-center gap-1.5 text-accent font-semibold text-sm group-hover:gap-2.5 transition-all duration-200">
          Learn More
          <ArrowRight className="size-4" />
        </span>
      </div>
    </Link>
  )
}
