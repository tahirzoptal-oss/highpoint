"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ChevronDown,
  Clock,
  Mail,
  MapPin,
  Menu,
  Phone,
  Star,
  X,
  Zap,
} from "lucide-react"
import { Button } from "@/components/Button"
import { Icon } from "@/components/Icon"
import { navigation, siteConfig } from "@/lib/site-config"

const nav = navigation.filter((item) =>
  ["Home", "Services", "Service Areas", "Gallery", "Reviews", "About", "Contact"].includes(item.label)
)

/**
 * NavItem: a top-level desktop nav link that becomes a hover dropdown when the
 * nav entry carries `children` (Services -> each service page, Service Areas ->
 * each location page). The trigger keeps the host variant's link className so it
 * matches the header; the panel is always a light card with navy links so it
 * reads under any header band. The pt-3 wrapper is a hover-bridge so the panel
 * stays open while the cursor travels from the label down into it.
 */
function NavItem({ item, className }: { item: any; className: string }) {
  const children = item.children as { label: string; href: string }[] | undefined
  if (!children || children.length === 0) {
    return (
      <Link href={item.href} className={className}>
        {item.label}
      </Link>
    )
  }
  return (
    <div className="relative group">
      <Link href={item.href} className={`inline-flex items-center gap-1 ${className}`}>
        {item.label}
        <ChevronDown className="size-4 transition-transform group-hover:rotate-180" />
      </Link>
      <div className="invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
        <div className="grid min-w-[240px] gap-0.5 rounded-[var(--radius-lg)] border border-black/10 bg-white p-2 shadow-xl">
          {children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-bold text-primary-dark hover:bg-[var(--color-surface-light)] hover:text-accent"
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * knockout: white-knockout treatment for the one dark header band (storm).
 * A dark or colored logo mark on a dark band disappears; brightness-0 invert
 * renders it white. The text wordmark keys its color to the band.
 */
function Logo({ knockout = false }: { knockout?: boolean }) {
  if (siteConfig.logo) {
    return (
      <Link
        href="/"
        className={
          knockout
            ? "inline-flex items-center rounded-[var(--radius-lg)] bg-white p-2"
            : "inline-flex items-center"
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={siteConfig.logo} alt={siteConfig.name} className="h-11 w-auto" />
      </Link>
    )
  }
  return (
    <Link href="/" className="inline-flex items-center text-2xl font-black">
      <span className={knockout ? "text-white" : "text-accent"}>
        {siteConfig.shortName}
      </span>
    </Link>
  )
}

function MobileMenu({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  if (!open) return null

  return (
    <div className="border-t border-black/10 bg-white px-4 pb-5 lg:hidden">
      <nav className="grid gap-2 py-4">
        {nav.map((item: any) => (
          <div key={item.href} className="grid gap-1">
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-xl border border-black/10 bg-[var(--color-surface-light)] px-4 py-3 font-black uppercase text-primary-dark"
            >
              {item.label}
            </Link>
            {Array.isArray(item.children) && item.children.length > 0 && (
              <div className="grid gap-1 pl-3">
                {item.children.map((child: any) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-4 py-2 text-sm font-bold text-primary-dark/80 hover:text-accent"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <Button
        href="#estimate-form"
        surface="light"
        className="w-full"
        onClick={() => setOpen(false)}
      >
        Get My Free Estimate
      </Button>
    </div>
  )
}

function MobileButton({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className="grid size-11 place-items-center rounded-xl border border-black/10 bg-white lg:hidden"
      aria-label="Toggle menu"
    >
      {open ? <X className="size-6" /> : <Menu className="size-6" />}
    </button>
  )
}

/* V1 */
export function HeaderAuthority() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="hidden bg-primary-dark text-white lg:block">
        <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between px-4 py-2 text-sm font-bold">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-accent-light" /> {siteConfig.city}, {siteConfig.address.state}
            </span>
            <span className="inline-flex items-center gap-2">
              <Star className="size-4 fill-star text-star" /> {siteConfig.reviews.googleRating.toFixed(1)} Reviews
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon name="shield-warranty" size={16} className="text-accent-light" /> Licensed & Insured
            </span>
          </div>

          <a href={`tel:${siteConfig.phoneRaw}`} className="whitespace-nowrap rounded-[var(--radius-lg)] bg-accent px-5 py-2 text-[var(--color-on-accent)]">
            {siteConfig.phone}
          </a>
        </div>
      </div>

      <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between px-4 py-5">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              className="font-black uppercase text-primary-dark hover:text-accent"
            />
          ))}
        </nav>

        <Button
          href="#estimate-form"
          surface="light"
          className="max-lg:hidden whitespace-nowrap"
        >
          Get My Free Estimate
        </Button>

        <MobileButton open={open} setOpen={setOpen} />
      </div>

      <MobileMenu open={open} setOpen={setOpen} />
    </header>
  )
}

/* V2 */
export function HeaderKCARoofing() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="hidden bg-primary-dark text-white lg:block">
        <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between px-4 py-2 text-sm font-bold">
          <a href={`tel:${siteConfig.phoneRaw}`} className="inline-flex items-center gap-2">
            <Phone className="size-4 text-accent-light" /> {siteConfig.phone}
          </a>
          {siteConfig.email && (
            <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-2">
              <Mail className="size-4 text-accent-light" /> {siteConfig.email}
            </a>
          )}
          <span className="inline-flex items-center gap-2">
            <Clock className="size-4 text-accent-light" /> Mon - Sat: 7AM - 7PM
          </span>
          <span>{siteConfig.license}</span>
        </div>
      </div>

      <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between px-4 py-5">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              className="font-black uppercase text-primary-dark hover:text-accent"
            />
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            href={`tel:${siteConfig.phoneRaw}`}
            intent="phone"
            surface="light"
            className="whitespace-nowrap"
          >
            Call Now
          </Button>
          <Button
            href="#estimate-form"
            surface="light"
            className="whitespace-nowrap"
          >
            Get My Free Estimate
          </Button>
        </div>

        <MobileButton open={open} setOpen={setOpen} />
      </div>

      <MobileMenu open={open} setOpen={setOpen} />
    </header>
  )
}

/* V3 */
export function HeaderCommercial() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="hidden border-b border-black/10 bg-primary-dark text-white lg:block">
        <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between px-4 py-3 text-sm font-bold">
          <span className="inline-flex items-center gap-2">
            <Icon name="roof-flat" size={16} className="text-accent-light" /> Serving {siteConfig.city}, {siteConfig.address.state} & Surrounding Areas
          </span>
          <span className="inline-flex items-center gap-2">
            <Icon name="shield-warranty" size={16} className="text-accent-light" /> Licensed & Insured
          </span>
          <span className="inline-flex items-center gap-2">
            <Star className="size-4 fill-star text-star" /> {siteConfig.reviews.googleRating.toFixed(1)} Reviews
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between px-4 py-5">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              className="font-black uppercase text-primary-dark hover:text-accent"
            />
          ))}
        </nav>

        <Button
          href="#estimate-form"
          surface="light"
          className="max-lg:hidden whitespace-nowrap"
        >
          Get My Free Estimate
        </Button>

        <MobileButton open={open} setOpen={setOpen} />
      </div>

      <MobileMenu open={open} setOpen={setOpen} />
    </header>
  )
}

/* V4 */
export function HeaderCenterAuthority() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="hidden border-b border-black/10 bg-white lg:block">
        <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between px-4 py-2 text-sm font-bold text-primary-dark">
          <a href={`tel:${siteConfig.phoneRaw}`} className="inline-flex items-center gap-2">
            <Phone className="size-4 text-accent" /> {siteConfig.phone}
          </a>
          {siteConfig.email && (
            <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-2">
              <Mail className="size-4 text-accent" /> {siteConfig.email}
            </a>
          )}
          <span>Follow Us: f · G · i</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-[var(--container-max)] items-center gap-6 px-4 py-5 lg:grid-cols-[1fr_auto_1fr]">
        <nav className="hidden items-center gap-7 lg:flex">
          {nav.slice(0, 3).map((item) => (
            <NavItem
              key={item.href}
              item={item}
              className="font-black uppercase text-primary-dark hover:text-accent"
            />
          ))}
        </nav>

        <div className="flex items-center justify-between lg:justify-center">
          <Logo />
          <MobileButton open={open} setOpen={setOpen} />
        </div>

        <div className="hidden items-center justify-end gap-5 lg:flex">
          <nav className="flex items-center gap-7">
            {nav.slice(3).map((item) => (
              <NavItem
                key={item.href}
                item={item}
                className="font-black uppercase text-primary-dark hover:text-accent"
              />
            ))}
          </nav>
          <Button
            href="#estimate-form"
            surface="light"
            className="whitespace-nowrap"
          >
            Get My Free Estimate
          </Button>
        </div>
      </div>

      <MobileMenu open={open} setOpen={setOpen} />
    </header>
  )
}

/**
 * pill-float, the storm-response floating pill nav (2B F6).
 *
 * LIGHT-HEADER LOCK HOLDS: V4/V5 show dark nav pills; ours ships LIGHT, a white
 * pill (.pill-nav) with navy links and a RED FILLED CTA, per the locked header
 * rule. The logo sits on the white pill so it reads (no knockout).
 *
 * Desktop (>= 1024px): the whole header is PINNED to the very top (the header
 * element is position:sticky, top:0, z-50), so the dark TopBar sits at y=0 on
 * load and the white pill sits right under it, welded to the top. The pill keeps
 * its rounded floating look but can no longer de-stick or drift to mid-page: the
 * sticky origin is the viewport top, and .pill-nav (a nested sticky) resolves
 * inside the short pinned header box, so it stays put. Below 1024px the standard
 * mobile white bar (logo + hamburger) + MobileMenu render instead, pairing with
 * the persistent MobileCtaBar. Storm-response pack signature only.
 */
export function HeaderPillFloat() {
  const [open, setOpen] = useState(false)

  return (
    // The header owns the sticky (sticky, top:0, z-50): the TopBar renders at
    // y=0 on load and the pill is welded directly beneath it. Because the header
    // box is short, the nested .pill-nav (position:sticky, top:16px) resolves its
    // sticky travel INSIDE this pinned header, so it renders at its flow position
    // and never travels to mid-page. No more empty top band or floating slice.
    <header className="sticky top-0 z-50">
      {/* Full-width TopBar (desktop): emergency line + phone, unchanged storm
       * treatment. Pinned to the very top with the pill. */}
      <div className="hidden bg-primary-dark text-white lg:block">
        <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between px-4 py-2 text-sm font-black uppercase">
          <span className="inline-flex items-center gap-2">
            <Zap className="size-4 text-accent-light" /> 24/7 Emergency Service
          </span>
          <a href={`tel:${siteConfig.phoneRaw}`} className="inline-flex items-center gap-2">
            <Phone className="size-4 text-accent-light" /> {siteConfig.phone}
          </a>
        </div>
      </div>

      {/* Desktop pill: white bar, navy links, red filled CTA. Sits flush under
       * the TopBar (pt-4 keeps the soft float gap while staying pinned). */}
      <div className="hidden px-4 pt-4 lg:block">
        <div className="pill-nav w-full px-3 pl-6">
          <Logo />

          <nav className="ml-8 flex items-center gap-7">
            {nav.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                className="font-black uppercase text-primary-dark hover:text-accent"
              />
            ))}
          </nav>

          <Button
            href="#estimate-form"
            surface="light"
            className="ml-auto whitespace-nowrap"
          >
            Get My Free Estimate
          </Button>
        </div>
      </div>

      {/* Mobile header (< 1024px): standard white bar + hamburger; pairs with
       * the persistent MobileCtaBar. No pill under 1024px. */}
      <div className="bg-white shadow-md lg:hidden">
        <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between px-4 py-4">
          <Logo />
          <MobileButton open={open} setOpen={setOpen} />
        </div>
        <MobileMenu open={open} setOpen={setOpen} />
      </div>
    </header>
  )
}

/* V5 */
export function HeaderStormResponse() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-primary-dark text-white shadow-md">
      <div className="bg-accent text-[var(--color-on-accent)]">
        <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between px-4 py-3 text-sm font-black uppercase">
          <span className="inline-flex items-center gap-2">
            <Zap className="size-4" /> 24/7 Emergency Service
          </span>
          <a href={`tel:${siteConfig.phoneRaw}`} className="inline-flex items-center gap-2 text-lg">
            <Phone className="size-5" /> {siteConfig.phone}
          </a>
        </div>
      </div>

      <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between px-4 py-5">
        <Logo knockout />

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              className="font-black uppercase text-white/75 hover:text-white"
            />
          ))}
        </nav>

        <Button
          href="#estimate-form"
          surface="dark"
          className="max-lg:hidden whitespace-nowrap"
        >
          Get My Free Estimate
        </Button>

        <MobileButton open={open} setOpen={setOpen} />
      </div>

      <MobileMenu open={open} setOpen={setOpen} />
    </header>
  )
}
