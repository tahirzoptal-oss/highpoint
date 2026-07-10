"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Phone, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/Button"
import { siteConfig, navigation } from "@/lib/site-config"

function useIsDuringBusinessHours() {
  const [isDuring, setIsDuring] = useState(true)

  useEffect(() => {
    const hour = new Date().getHours()
    setIsDuring(hour >= 9 && hour < 17)
  }, [])

  return isDuring
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const isDuringBusinessHours = useIsDuringBusinessHours()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary-dark/95 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <span className="text-xl font-bold font-heading text-foreground">
              <span className="text-accent">{siteConfig.shortName}</span> Contracting
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="px-3 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              About Us
            </Link>
            {navigation
              .filter((item) => "children" in item && item.children)
              .map((item) => (
                <div key={item.label} className="relative group">
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors">
                    {item.label}
                    <ChevronDown className="size-3.5" />
                  </button>
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="rounded-xl border border-border bg-card shadow-xl p-2 min-w-[220px]">
                      {Array.isArray((item as any).children) &&
  (item as any).children.map((child: any) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-background/50 rounded-lg transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            <Link
              href="/gallery"
              className="px-3 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Gallery
            </Link>
            <Link
              href="/service-areas"
              className="px-3 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Service Areas
            </Link>
          </nav>

          {/* Desktop: Phone + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-accent transition-colors"
            >
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-success" />
              </span>
              <Phone className="size-4" />
              <span className="flex flex-col leading-tight">
                <span className="text-xs text-muted">We&apos;re Available Now</span>
                <span>{siteConfig.phone}</span>
              </span>
            </a>
            <Button href="#estimate-form" surface="dark" className="whitespace-nowrap">
              Get My Free Estimate
            </Button>
          </div>

          {/* Mobile: Dynamic CTA + Hamburger */}
          <div className="flex lg:hidden items-center gap-3">
            {isDuringBusinessHours ? (
              <Button
                href={`tel:${siteConfig.phoneRaw}`}
                surface="dark"
                className="whitespace-nowrap"
              >
                <Phone className="size-4 shrink-0" />
                Call Now
              </Button>
            ) : (
              <Button
                href="#estimate-form"
                surface="dark"
                className="whitespace-nowrap"
                onClick={() => setMobileOpen(false)}
              >
                Get My Free Estimate
              </Button>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-muted hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-primary-dark/95 backdrop-blur-md">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-3 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-3 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              About Us
            </Link>
            {navigation
              .filter((item) => "children" in item && item.children)
              .map((item) => (
                <div key={item.label}>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="flex items-center justify-between w-full px-3 py-3 text-sm font-medium text-muted hover:text-foreground transition-colors"
                  >
                    {item.label}
                    <ChevronDown
                      className={`size-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {servicesOpen && "children" in item && (
                    <div className="pl-4 space-y-1">
                      {Array.isArray((item as any).children) &&
  (item as any).children.map((child: any) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-3 py-2.5 text-sm text-muted hover:text-foreground transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            <Link
              href="/gallery"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-3 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Gallery
            </Link>
            <Link
              href="/service-areas"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-3 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Service Areas
            </Link>
            <div className="pt-4 border-t border-border space-y-3">
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
                onClick={() => setMobileOpen(false)}
              >
                Get My Free Estimate
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
