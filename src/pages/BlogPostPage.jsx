import { useParams, Link, Navigate } from 'react-router-dom';
import InnerBanner from '../components/InnerBanner';
import LogoSlider from '../components/LogoSlider';
import BeltSlider from '../components/BeltSlider';
import SEO from '../components/SEO';
// The exact layout primitives the service detail pages use — same bands, same
// 67/30 column split, same sticky rail, same copy renderer. Only the content
// inside the left column differs.
import { Band, StickyRail, SiloBody } from '../components/SiloSection';
import { buildArticle, buildBreadcrumb } from '../lib/schema';
import { blogPosts } from './BlogPage';
import { brandDNA } from '../config/brand-dna';

const INTER = "'Inter', system-ui, -apple-system, sans-serif";
const JOSEFIN = "'Josefin Sans', system-ui, sans-serif";

// Covers are authored as .png/.jpg in brand-dna but shipped as .webp.
const coverOf = (post) => (post.cover || '/work/project1.webp').replace(/\.(png|jpe?g)$/i, '.webp');

// Structured content blocks ({type:'p'|'h2'|'list'}) predate the shared copy
// renderer. Fold them back into markdown so one renderer owns every article,
// whichever shape the post shipped in.
const blocksToMarkdown = (blocks) =>
  blocks
    .map((b) => {
      if (b.type === 'h2') return `## ${b.text}`;
      if (b.type === 'list') return (b.items || []).map((i) => `- ${i}`).join('\n');
      return b.text || '';
    })
    .filter(Boolean)
    .join('\n\n');

const ArrowLeft = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M20 12H5M11 18l-6-6 6-6" />
  </svg>
);

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  // Order of preference: the copy-deck body markdown, then structured content
  // blocks folded into markdown, then the excerpt as a last resort.
  const markdown =
    post.body
    || ((post.content && post.content.length) ? blocksToMarkdown(post.content) : '')
    || post.excerpt
    || '';

  return (
    <>
      <SEO
        path={`/blog/${slug}`}
        title={`${post.title} | ${brandDNA.company.name}`}
        description={post.excerpt}
        image={coverOf(post)}
        jsonLd={[
          buildArticle(post),
          buildBreadcrumb([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${slug}` },
          ]),
        ]}
      />

      {/* ════ 1. Banner — the post's own cover as the background, the shared
             dark scrim over it, the post title as the <h1>, and the category /
             date / read-time meta riding in as children. ════ */}
      <InnerBanner
        title={post.title}
        image={coverOf(post)}
        objectPosition="50% 40%"
        overlayOpacity={0.92}
        breadcrumb={[{ label: 'Blog', to: '/blog' }, { label: post.category }]}
        minHeightClass="min-h-[44vh] lg:min-h-[50vh]"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] font-medium" style={{ fontFamily: INTER, color: 'rgba(255,255,255,0.68)' }}>
          {post.category && (
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-[10.5px] font-bold uppercase leading-none tracking-[0.12em]"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)', color: '#FFFFFF' }}
            >
              {post.category}
            </span>
          )}
          {post.date && <span>{post.date}</span>}
          {post.date && post.readTime && <span aria-hidden style={{ color: 'rgb(var(--accent-light))' }}>·</span>}
          {post.readTime && <span>{post.readTime}</span>}
          {post.byline && <span aria-hidden style={{ color: 'rgb(var(--accent-light))' }}>·</span>}
          {post.byline && <span>By {post.byline}</span>}
        </div>
      </InnerBanner>

      {/* ════ 2 & 3. Global logo slider + brand belt ════ */}
      <LogoSlider />
      <BeltSlider />

      {/* ════ SILO — identical to the service pages: 67% article on the left,
             the quote form floating over the right third and pinned until the
             band ends. Below lg the rail drops into normal flow and stops
             being sticky. ════ */}
      <div className="relative">
        {/* ── Sticky quote rail. DOM position matters ONLY below lg, where the
               rail is in normal flow — first child, so on tablet/mobile the
               form is the first thing under the belt slider, ahead of the
               article. From lg it is `absolute inset-0` over the whole stack,
               so its position in the document has no effect on the desktop
               layout at all. ── */}
        <StickyRail formId={`blog-${slug}`} />

        <Band tone="white">
          <article>
            {/* Featured image at the top of the article */}
            <figure
              className="m-0 overflow-hidden rounded-[22px]"
              style={{ border: '1px solid rgba(16,40,79,0.07)', boxShadow: '0 1px 2px rgba(16,40,79,0.04), 0 18px 44px -24px rgba(16,40,79,0.3)' }}
            >
              <img
                src={coverOf(post)}
                alt={post.title}
                className="block aspect-[16/9] w-full object-cover"
                decoding="async"
              />
            </figure>

            {/* Lead — the excerpt, set larger than the body so the article opens
                with a clear step down in hierarchy. */}
            {post.excerpt && (
              <p
                className="mt-8 pl-5 text-[17px] leading-[1.75] text-ink/80"
                style={{ fontFamily: INTER, borderLeft: '3px solid rgb(var(--accent))' }}
              >
                {post.excerpt}
              </p>
            )}

            {/* Body — headings, paragraphs, bullet and numbered lists, quotes,
                bold, emphasis and inline links, all through the shared renderer.
                Capped to a readable measure inside the 67% column. */}
            <div className="mt-8">
              <SiloBody body={markdown} />
            </div>

            {/* ── Post meta / author ── */}
            <div
              className="mt-12 flex flex-wrap items-center gap-4 rounded-[18px] bg-white p-5 shadow-[0_1px_2px_rgba(16,40,79,0.04),0_14px_34px_-20px_rgba(16,40,79,0.22)]"
              style={{ border: '1px solid rgba(16,40,79,0.07)' }}
            >
              <img
                src="/owner.webp"
                alt={brandDNA.team.founder.name}
                className="h-14 w-14 flex-shrink-0 rounded-full object-cover"
                style={{ objectPosition: '50% 10%' }}
                loading="lazy"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="min-w-0">
                <div
                  className="text-[15px] font-bold uppercase leading-[1.3] tracking-[0.04em]"
                  style={{ fontFamily: JOSEFIN, color: 'rgb(var(--primary-dark))' }}
                >
                  {brandDNA.company.name}
                </div>
                <p className="mt-1.5 text-[14px] leading-[1.6] text-ink/70" style={{ fontFamily: INTER }}>
                  {brandDNA.team.founder.name}, {brandDNA.team.founder.title}.
                  {post.date ? ` Published ${post.date}.` : ''}
                </p>
              </div>
            </div>

            {/* ── Back to blog ── */}
            <Link
              to="/blog"
              className="group mt-8 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors duration-300 ease-out hover:text-[rgb(var(--primary))]"
              style={{ fontFamily: INTER, color: 'rgb(var(--accent))' }}
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:-translate-x-1" />
              Back to all articles
            </Link>
          </article>
        </Band>
      </div>
    </>
  );
}
