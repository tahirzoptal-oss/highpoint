import { useState, useMemo, useRef } from 'react';
import InnerBanner from '../components/InnerBanner';
import LogoSlider from '../components/LogoSlider';
import BeltSlider from '../components/BeltSlider';
import CTABanner from '../components/CTABanner';
import { CTA_FORM } from '../config/form-ids';
import SEO from '../components/SEO';
// The listing reuses the homepage blog card verbatim — same cover ratio, meta
// row, title treatment and "Read More" affordance — so the two never drift.
import { PostCard } from '../components/Blog';
import { buildBreadcrumb } from '../lib/schema';
import { useLivePosts } from '../lib/useLiveClock';
import { brandDNA } from '../config/brand-dna';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";

const POSTS_PER_PAGE = 6;

const Chevron = ({ dir, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </svg>
);

// Prev / Next control. Disabled at the ends rather than hidden, so the row
// keeps its shape on every page.
const PageArrow = ({ dir, label, disabled, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[rgb(var(--primary))] shadow-[0_1px_2px_rgba(16,40,79,0.04),0_10px_24px_-16px_rgba(16,40,79,0.24)] transition-[background-color,color] duration-300 ease-out enabled:hover:bg-[rgb(var(--primary))] enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))] focus-visible:ring-offset-2"
    style={{ border: '1px solid rgba(16,40,79,0.1)', fontFamily: INTER }}
  >
    {dir === 'left' && <Chevron dir="left" className="h-3.5 w-3.5" />}
    <span className="hidden sm:inline">{label}</span>
    {dir === 'right' && <Chevron dir="right" className="h-3.5 w-3.5" />}
  </button>
);

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);
  const gridRef = useRef(null);

  // Live posts as of the visitor's clock, newest publication first. Recomputed
  // when a scheduled post's time arrives, so the listing picks it up without a
  // rebuild — everything below derives from this one list.
  const postsNewestFirst = useLivePosts();

  // The featured slot follows publication date — it is not authored. Whatever
  // published most recently wears the chip, so the next article to go live takes
  // the slot over on its own and the `featured` flag in brand-dna never has to be
  // moved from one post to the next.
  const featuredSlug = (postsNewestFirst[0] || {}).slug;

  // A category with no live post behind it would open onto an empty grid, so the
  // filter row only offers the ones that actually have something to show. A
  // category whose only article has not published yet drops out on its own and
  // returns by itself the moment that article goes live.
  const categories = useMemo(() => {
    const used = new Set(postsNewestFirst.map((p) => p.category).filter(Boolean));
    return (brandDNA.blog_categories || []).filter((cat) => cat === 'All' || used.has(cat));
  }, [postsNewestFirst]);

  // Filtered set, newest publication first in every tab — `postsNewestFirst` is
  // already in that order and filtering preserves it, so the listing always
  // opens on the most recent article and the featured story leads the grid.
  const filtered = useMemo(() => (
    activeCategory === 'All'
      ? postsNewestFirst
      : postsNewestFirst.filter((p) => p.category === activeCategory)
  ), [activeCategory, postsNewestFirst]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * POSTS_PER_PAGE, current * POSTS_PER_PAGE);

  // Paging keeps the grid in view instead of leaving the reader mid-page.
  const goTo = (next) => {
    setPage(Math.min(Math.max(1, next), pageCount));
    if (gridRef.current) gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const pickCategory = (cat) => { setActiveCategory(cat); setPage(1); };

  return (
    <>
      <SEO
        path="/blog"
        title={`Roofing Blog | ${brandDNA.company.name}`}
        description="Roofing tips, cost guides, and storm-damage advice for Kennewick and Tri-Cities homeowners, straight from High Point's owner-operator."
        jsonLd={buildBreadcrumb([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }])}
      />

      {/* ════ 1. Banner — shared InnerBanner component ════ */}
      <InnerBanner
        title={brandDNA.pages.blog.heading}
        subtitle={brandDNA.pages.blog.intro}
        breadcrumb={[{ label: 'Blog' }]}
        minHeightClass="min-h-[44vh] lg:min-h-[50vh]"
      />

      {/* ════ 2 & 3. Global logo slider + brand belt ════ */}
      <LogoSlider />
      <BeltSlider />

      {/* ════ 4. Blog grid ════ */}
      <section ref={gridRef} className="relative overflow-hidden py-14 lg:py-20">
        {/* Soft mesh base — the same palette the homepage blog strip sits on. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(48% 44% at 90% 10%, rgba(110,143,196,0.18) 0%, transparent 62%),' +
              'radial-gradient(44% 40% at 8% 16%, rgba(44,90,166,0.12) 0%, transparent 64%),' +
              'radial-gradient(52% 48% at 50% 100%, rgba(24,60,120,0.10) 0%, transparent 62%),' +
              'linear-gradient(170deg, #FFFFFF 0%, #F6F9FD 52%, #E9F0F9 100%)',
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-16 bottom-8 h-64 w-64 rounded-full blur-3xl" style={{ background: 'rgb(var(--accent-light) / 0.18)' }} />
          <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--accent) / 0.3), transparent)' }} />
        </div>

        <div className="site-container relative">
          {/* Category filter — existing behaviour, restyled for the light page. */}
          {categories && categories.length > 1 && (
            <div className="mb-8 flex flex-wrap gap-2 lg:mb-10">
              {categories.map((cat) => {
                const active = cat === activeCategory;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => pickCategory(cat)}
                    aria-pressed={active}
                    className={`rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] transition-[background-color,color,border-color] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))] focus-visible:ring-offset-2 ${
                      active ? '' : 'text-ink/65 hover:text-[rgb(var(--primary))]'
                    }`}
                    style={{
                      fontFamily: INTER,
                      background: active
                        ? 'linear-gradient(150deg, rgb(var(--accent-light)), rgb(var(--accent)) 55%, rgb(var(--primary)))'
                        : 'rgba(255,255,255,0.9)',
                      border: active ? '1px solid rgb(var(--accent) / 0.4)' : '1px solid rgba(16,40,79,0.1)',
                      color: active ? 'rgb(var(--on-accent))' : undefined,
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}

          {visible.length === 0 ? (
            <p className="py-10 text-[15px] leading-[1.72] text-ink/70" style={{ fontFamily: INTER }}>
              No articles in this category yet. Check back soon.
            </p>
          ) : (
            /* 3 / 2 / 1 columns. Grid items stretch and the card is `h-full`,
               so every card in a row ends flush regardless of copy length. */
            <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {visible.map((post) => (
                <li key={post.slug} className="flex">
                  <PostCard post={post} featured={post.slug === featuredSlug} />
                </li>
              ))}
            </ul>
          )}

          {/* ── Pagination — 6 posts per page ── */}
          {pageCount > 1 && (
            <nav aria-label="Blog pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2 lg:mt-14">
              <PageArrow dir="left" label="Previous" disabled={current === 1} onClick={() => goTo(current - 1)} />

              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => {
                const active = n === current;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => goTo(n)}
                    aria-label={`Page ${n}`}
                    aria-current={active ? 'page' : undefined}
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-bold transition-[background-color,color] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))] focus-visible:ring-offset-2 ${
                      active ? '' : 'hover:text-[rgb(var(--primary))]'
                    }`}
                    style={{
                      fontFamily: INTER,
                      background: active
                        ? 'linear-gradient(150deg, rgb(var(--accent-light)), rgb(var(--accent)) 55%, rgb(var(--primary)))'
                        : 'rgba(255,255,255,0.9)',
                      border: active ? '1px solid rgb(var(--accent) / 0.4)' : '1px solid rgba(16,40,79,0.1)',
                      color: active ? 'rgb(var(--on-accent))' : 'rgb(var(--ink) / 0.7)',
                      boxShadow: active
                        ? '0 10px 24px -14px rgb(var(--accent) / 0.7)'
                        : '0 1px 2px rgba(16,40,79,0.04)',
                    }}
                  >
                    {n}
                  </button>
                );
              })}

              <PageArrow dir="right" label="Next" disabled={current === pageCount} onClick={() => goTo(current + 1)} />
            </nav>
          )}
        </div>
      </section>

      {/* ════ 5. Global CTA ════ */}
      <CTABanner formId={CTA_FORM.blog} />
    </>
  );
}
