"use client"

import Link from "next/link"
import { Menu, Star, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/Button"
import { Icon } from "@/components/Icon"
import { IconChip } from "@/components/IconChip"
import { navigation, siteConfig } from "@/lib/site-config"

const mainNav = navigation.filter((item) =>
  ["Home", "About", "Gallery", "Service Areas", "Contact"].includes(item.label)
)

export function HeaderPremium() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface-dark)] text-white shadow-xl">
      <div className="border-b border-white/10 bg-white/[0.03]">
        <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between gap-4 px-4 py-2 text-xs font-black uppercase tracking-widest text-white/70 sm:px-6 lg:px-8">
          <div className="hidden items-center gap-6 md:flex">
            <span className="inline-flex items-center gap-2">
              <Star className="size-4 fill-star text-star" />
              {siteConfig.reviews.googleRating.toFixed(1)} Google Rated
            </span>

            <span className="inline-flex items-center gap-2">
              <Icon name="shield-warranty" size={16} className="text-accent-light" />
              {siteConfig.license}
            </span>
          </div>

          <div className="mx-auto md:mx-0">
            Serving {siteConfig.city} & Surrounding Areas
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-black tracking-tight">
          <span className="text-accent">{siteConfig.shortName}</span>
          <span className="ml-2 text-white">Contracting</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-bold text-white/65 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={`tel:${siteConfig.phoneRaw}`}
            className="flex items-center gap-3 text-sm font-black"
          >
            <IconChip name="Phone" surface="dark" size={40} />

            <span>
              <span className="block text-xs font-bold text-white/45">
                Call Now
              </span>
              {siteConfig.phone}
            </span>
          </a>

          <Button
            href="#estimate-form"
            surface="dark"
            className="whitespace-nowrap"
          >
            Get Free Estimate
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid size-11 place-items-center rounded-xl border border-white/10 bg-white/5 lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[var(--color-surface-dark)] px-4 pb-5 lg:hidden">
          <nav className="grid gap-2 py-4">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-white/80"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="grid gap-3">
            <Button
              href={`tel:${siteConfig.phoneRaw}`}
              intent="phone"
              surface="dark"
              className="w-full"
            >
              {siteConfig.phone}
            </Button>

            <Button
              href="#estimate-form"
              surface="dark"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Get Free Estimate
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  )
}
