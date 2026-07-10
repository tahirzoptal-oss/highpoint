"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import type { AnchorHTMLAttributes } from "react"
import { CheckCircle, User, Phone, Mail, MapPin, MessageSquare, ShieldCheck } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { Button } from "@/components/Button"
import { StatNumeral } from "@/components/StatNumeral"

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "Phone number is required"),
  email: z.string().email("Valid email is required"),
  address: z.string().optional(),
  service: z.string().optional(),
  message: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

// Closer variant (spec 2.7): 2-3 fields max, so the schema drops email,
// address and service. Name + phone are all the callback promise needs.
const closerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "Phone number is required"),
  message: z.string().optional(),
})

type CloserData = z.infer<typeof closerSchema>

const serviceOptions = [
  "Roof Replacement",
  "Roof Repair",
  "Storm Damage",
  "Insurance Claim",
  "Siding",
  "Gutters",
  "Other",
] as const

// The form card is forced white (it sits on dark/navy sections), so its
// inputs use white-card-safe colors rather than theme background vars.
const inputClasses =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-primary-dark placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"

// Static-export friendly: POST the lead straight to the configured webhook
// (e.g. GHL / Zapier). Fail-silent so a network or CORS issue never blocks
// the confirmation. Set the endpoint in siteConfig.leadWebhook or the
// NEXT_PUBLIC_LEAD_WEBHOOK env var.
async function postLead(data: Record<string, unknown>) {
  const endpoint = process.env.NEXT_PUBLIC_LEAD_WEBHOOK || siteConfig.leadWebhook
  if (!endpoint) return
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, source: siteConfig.name }),
    })
  } catch {
    // ignore, still confirm to the user
  }
}

/** Shared post-submit confirmation card (default and closer variants). */
function SuccessCard() {
  return (
    <div
      id="estimate-form"
      className="rounded-2xl bg-white p-8 text-center shadow-xl"
    >
      <div className="mb-4 inline-flex size-16 items-center justify-center rounded-full bg-success/10">
        <CheckCircle className="size-8 text-success" />
      </div>

      <h3 className="mb-2 font-heading text-xl font-bold text-primary-dark">
        Thanks for trusting us, here&apos;s what happens next
      </h3>

      <p className="mx-auto max-w-md text-slate-500">
        A member of our team will call you back within 5 minutes during business
        hours. We&apos;ll answer your questions and schedule a time that works
        for you.
      </p>

      <Button
        href={`tel:${siteConfig.phoneRaw}`}
        intent="primary"
        surface="light"
        className="mt-6"
      >
        Or call us now: {siteConfig.phone}
      </Button>
    </div>
  )
}

/**
 * Closer form (spec 2.7): the conversion-crescendo card. Same white card
 * anatomy as the default form, but only name + phone + an optional message,
 * with a display-scale phone numeral (StatNumeral lg) and the callback
 * promise rendered as a badge. All locked CRO phrases stay verbatim.
 */
function CloserForm() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CloserData>({
    resolver: zodResolver(closerSchema),
  })

  const onSubmit = async (data: CloserData) => {
    await postLead(data)
    setSubmitted(true)
  }

  // Button spreads extra props onto the underlying <button> AFTER its
  // type="button" default, so the submit type and disabled state pass through.
  // Its prop surface is typed for anchors, hence the cast.
  const submitProps = {
    type: "submit",
    disabled: isSubmitting,
  } as unknown as AnchorHTMLAttributes<HTMLAnchorElement>

  if (submitted) return <SuccessCard />

  return (
    <div
      id="estimate-form"
      className="overflow-hidden rounded-2xl bg-white shadow-xl"
    >
      <div className="p-6 text-center md:p-8">
        {/* Callback promise as a badge. Accent FILL is dark-surface safe and
         * the label keys to the badge surface via --color-on-accent. */}
        <span className="inline-flex items-center rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-on-accent)]">
          We call you back in 5 minutes!
        </span>

        {/* Display-scale phone number: StatNumeral lg, tappable. The card is
         * forced white, so the label overrides text-muted with a card-safe
         * slate via the .stat-label hook. */}
        <a
          href={`tel:${siteConfig.phoneRaw}`}
          className="mt-5 inline-block text-primary-dark [&_.stat-label]:text-slate-500"
        >
          <StatNumeral
            value={siteConfig.phone}
            label="We're Available Now"
            size="lg"
            className="items-center"
          />
        </a>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 space-y-4 text-left"
        >
          <div>
            <div className="relative">
              <User aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted" />
              <input
                {...register("name")}
                placeholder="Full Name *"
                className={`${inputClasses} pl-11`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-danger">{errors.name.message}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <Phone aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted" />
              <input
                {...register("phone")}
                placeholder="Phone Number *"
                type="tel"
                className={`${inputClasses} pl-11`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-danger">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <MessageSquare aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted" />
              <input
                {...register("message")}
                placeholder="How Can We Help? (optional)"
                className={`${inputClasses} pl-11`}
              />
            </div>
          </div>

          <Button
            intent="primary"
            surface="light"
            size="lg"
            className="w-full disabled:cursor-not-allowed disabled:opacity-50"
            {...submitProps}
          >
            {isSubmitting ? "Sending..." : "Get My Free Estimate"}
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
            <ShieldCheck aria-hidden="true" className="size-4 text-accent" />
            No obligation. No pressure. You&apos;re in control.
          </p>

          <p className="text-center text-xs text-slate-500">
            We will never send you unsolicited spam.
          </p>
        </form>
      </div>
    </div>
  )
}

export function ContactForm({
  variant = "default",
  showHeader = true,
}: {
  variant?: "default" | "hero-connected" | "hero-integrated" | "closer"
  /** When false, render only the white form card (the surrounding section
   * supplies its own heading). Lets a CTA put the heading on a dark background
   * in white text with no nested white container. */
  showHeader?: boolean
}) {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  // The closer variant owns its own schema, state and card (spec 2.7).
  // Dispatched after the hooks above so hook order stays unconditional.
  if (variant === "closer") return <CloserForm />

  const onSubmit = async (data: FormData) => {
    await postLead(data)
    setSubmitted(true)
  }

  const isHero = variant === "hero-connected"
  const isIntegrated = variant === "hero-integrated"

  const heroInputClasses =
    "h-14 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-primary-dark placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"

  // Integrated variant: the hero wraps this in a translucent tinted panel, so
  // the fields sit on a dark surface. Inputs take a tonal-step fill + white
  // text (the v2 contrast invariant), with room on the right for the trailing
  // glyph. pr-11 leaves the glyph its lane; the glyph itself is aria-hidden.
  const integratedInputClasses =
    "h-12 w-full rounded-[var(--radius-lg)] border border-white/15 bg-white/10 px-4 pr-11 text-sm text-white placeholder:text-white/55 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/60 transition-colors"

  // Button spreads extra props onto the underlying <button> AFTER its
  // type="button" default, so the submit type and disabled state pass through.
  // Its prop surface is typed for anchors, hence the cast.
  const submitProps = {
    type: "submit",
    disabled: isSubmitting,
  } as unknown as AnchorHTMLAttributes<HTMLAnchorElement>

  if (submitted) return <SuccessCard />

  if (isHero) {
    return (
      <div id="estimate-form">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <input
                {...register("name")}
                placeholder="Name"
                className={heroInputClasses}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-danger">{errors.name.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("phone")}
                placeholder="Phone"
                type="tel"
                className={heroInputClasses}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-danger">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("email")}
                placeholder="Email"
                type="email"
                className={heroInputClasses}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("address")}
                placeholder="Address"
                className={heroInputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.4fr_.85fr]">
            <select
              {...register("service")}
              defaultValue=""
              className={`${heroInputClasses} appearance-none`}
            >
              <option value="" disabled>
                Select Service
              </option>

              {serviceOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <input
              {...register("message")}
              placeholder="How Can We Help?"
              className={heroInputClasses}
            />

            <Button
              intent="primary"
              surface="light"
              size="lg"
              className="w-full disabled:cursor-not-allowed disabled:opacity-50"
              {...submitProps}
            >
              {isSubmitting ? "Sending..." : "Get My Free Estimate"}
            </Button>
          </div>

          {/* Inside the white-card composition, so it keys to the card surface. */}
          <p className="text-center text-xs text-slate-500">
            Your information is 100% secure and never shared.
          </p>
        </form>
      </div>
    )
  }

  if (isIntegrated) {
    // The hero owns the translucent tinted panel around this form, so it reads
    // as part of the hero (not a floating white widget). Everything here keys
    // to that dark panel: white heading + labels, tonal-step fields, trailing
    // Lucide glyphs inside each field. The accent-word knockout on the heading
    // renders accent-light (accent-on-dark is banned; this is a NON-locked
    // heading, never one of the 6 CRO phrases). All 6 locked phrases render
    // verbatim + unstyled below.
    return (
      <div id="estimate-form" className="text-left">
        {/* Non-locked heading with the accent-word knockout (D3). "Free" is the
         * knockout; "Get My Free Estimate" (the locked phrase) stays on the
         * button, verbatim + unstyled. */}
        <h2 className="font-heading text-2xl font-black uppercase leading-tight tracking-tight text-white md:text-3xl">
          Your <span className="text-accent-light">Free</span> Roof Estimate
        </h2>

        <div className="mt-1.5 inline-flex items-center gap-2 text-sm font-semibold text-white/70">
          <span className="size-2 shrink-0 rounded-full bg-success animate-pulse-dot" />
          We call you back in 5 minutes!
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-3.5">
          <div className="relative">
            <input
              {...register("name")}
              placeholder="Full Name *"
              className={integratedInputClasses}
            />
            <User
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-white/45"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-danger">{errors.name.message}</p>
            )}
          </div>

          <div className="relative">
            <input
              {...register("phone")}
              placeholder="Phone Number *"
              type="tel"
              className={integratedInputClasses}
            />
            <Phone
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-white/45"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-danger">{errors.phone.message}</p>
            )}
          </div>

          <div className="relative">
            <input
              {...register("email")}
              placeholder="Email Address *"
              type="email"
              className={integratedInputClasses}
            />
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-white/45"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
            )}
          </div>

          <div className="relative">
            <input
              {...register("address")}
              placeholder="Property Address (optional)"
              className={integratedInputClasses}
            />
            <MapPin
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-white/45"
            />
          </div>

          <Button
            intent="primary"
            surface="dark"
            size="lg"
            className="w-full disabled:cursor-not-allowed disabled:opacity-50"
            {...submitProps}
          >
            {isSubmitting ? "Sending..." : "Get My Free Estimate"}
          </Button>

          {/* The 3 remaining locked phrases, verbatim + unstyled, keyed to the
           * dark panel. white/70 clears AA (5.0:1) on the tinted panel; white/60
           * grazed under 4.5:1. */}
          <p className="text-center text-xs text-white/70">
            No obligation. No pressure. You&apos;re in control.
          </p>

          <p className="text-center text-xs text-white/70">
            We will never send you unsolicited spam.
          </p>
        </form>
      </div>
    )
  }

  return (
    /* The promise heading lives INSIDE the card as a clip-safe strip with its
     * own dark surface, so its text keys to the strip, never to the section
     * band behind the card (the white-on-white heading bug). overflow-hidden
     * keeps the strip inside the card radius on every corner style. */
    <div
      id="estimate-form"
      className="overflow-hidden rounded-2xl bg-white shadow-xl"
    >
      {showHeader && (
        <div className="bg-primary-dark px-6 py-5 text-center">
          <h3 className="font-heading text-xl font-bold text-white">
            We call you back in 5 minutes!
          </h3>

          <p className="mt-1 text-sm text-white/80">
            No obligation. No pressure. Just honest answers.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6 md:p-8">
        <div>
          <input
            {...register("name")}
            placeholder="Full Name *"
            className={inputClasses}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-danger">{errors.name.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("phone")}
            placeholder="Phone Number *"
            type="tel"
            className={inputClasses}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-danger">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("email")}
            placeholder="Email Address *"
            type="email"
            className={inputClasses}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("address")}
            placeholder="Property Address (optional)"
            className={inputClasses}
          />
        </div>

        <div>
          <select
            {...register("service")}
            defaultValue=""
            className={`${inputClasses} appearance-none`}
          >
            <option value="" disabled>
              How Can We Help? (select one)
            </option>

            {serviceOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <Button
          intent="primary"
          surface="light"
          size="lg"
          className="w-full disabled:cursor-not-allowed disabled:opacity-50"
          {...submitProps}
        >
          {isSubmitting ? "Sending..." : "Get My Free Estimate"}
        </Button>

        <p className="text-center text-xs text-slate-500">
          We will never send you unsolicited spam.
        </p>
      </form>
    </div>
  )
}
