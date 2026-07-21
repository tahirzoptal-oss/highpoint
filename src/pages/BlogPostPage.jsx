import { useParams, Link, Navigate } from 'react-router-dom';
import InnerBanner from '../components/InnerBanner';
import CTABanner from '../components/CTABanner';
import SEO from '../components/SEO';
import QuoteForm from '../components/QuoteForm';
import { buildArticle, buildBreadcrumb } from '../lib/schema';
import { blogPosts } from './BlogPage';
import { brandDNA } from '../config/brand-dna';


const INTER = "'Inter', system-ui, -apple-system, sans-serif";

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  // Convert a copy-deck markdown body into the BlogPostPage content-block shape
  // ({type:'p'|'h2'|'list', text|items}). Allows post.body (Stage 6 markdown) to
  // back-fill the content array when no structured content blocks shipped.
  const blocksFromMarkdown = (md) => {
    if (!md) return null;
    return md.trim().split(/\n\s*\n/).map((blk) => {
      const t = blk.trim();
      if (t.startsWith('## ')) return { type: 'h2', text: t.replace(/^##\s+/, '').replace(/\*([^*]+)\*/g, '$1') };
      if (t.startsWith('- ')) return { type: 'list', items: t.split(/\n- /).map((s) => s.replace(/^- /, '').trim()).filter(Boolean) };
      return { type: 'p', text: t };
    });
  };

  // brandDNA.blog_posts[i].content is the schema-defined rich body. Order of
  // preference: structured content blocks, copy-deck body markdown, excerpt fallback.
  const contentBlocks =
    (post.content && post.content.length > 0)
      ? post.content
      : (blocksFromMarkdown(post.body) || [{ type: 'p', text: post.excerpt }]);

  return (
    <>
      <SEO
        path={`/blog/${slug}`}
        title={`${post.title} | ${brandDNA.company.name}`}
        description={post.excerpt}
        jsonLd={[
          buildArticle(post),
          buildBreadcrumb([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${slug}` },
          ]),
        ]}
      />
      {/* Article banner — shared InnerBanner component. The post's own cover
          is the background, and the meta row rides in as children. */}
      <InnerBanner
        title={post.title}
        image={post.cover}
        objectPosition="50% 40%"
        overlayOpacity={0.92}
        breadcrumb={[{ label: 'Blog', to: '/blog' }, { label: post.category }]}
        minHeightClass="min-h-[44vh] lg:min-h-[50vh]"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] font-medium" style={{ fontFamily: INTER, color: 'rgba(255,255,255,0.68)' }}>
          {post.readTime && <span>{post.readTime}</span>}
          {post.readTime && post.date && <span aria-hidden style={{ color: 'rgb(var(--accent-light))' }}>·</span>}
          {post.date && <span>{post.date}</span>}
          {post.byline && <span aria-hidden style={{ color: 'rgb(var(--accent-light))' }}>·</span>}
          {post.byline && <span>By {post.byline}</span>}
        </div>
      </InnerBanner>

      {/* Article Body */}
      <section className="relative py-16 bg-grid bg-navy">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Main content */}
            <article className="lg:col-span-2">
              <p className="text-cool text-base leading-relaxed mb-6 text-lg pl-5" style={{ borderLeft: '2px solid rgb(var(--accent))' }}>
                {post.excerpt}
              </p>

              <div>
                {contentBlocks.map((block, i) => {
                  if (block.type === 'p') {
                    return <p key={i} className="text-cool text-sm leading-relaxed mb-5">{block.text}</p>;
                  }
                  if (block.type === 'h2') {
                    return <h2 key={i} className="font-heading font-bold text-white uppercase text-2xl mt-8 mb-4">{block.text}</h2>;
                  }
                  if (block.type === 'list') {
                    return (
                      <ul key={i} className="flex flex-col gap-2 mb-5">
                        {block.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-3 text-cool text-sm leading-relaxed">
                            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 bg-navy-slate" style={{ border: '1px solid rgba(100,116,139,0.5)' }}>
                              <svg className="w-2.5 h-2.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Author box */}
              <div className="mt-8 flex items-center gap-4 p-5 bg-navy-slate" style={{ border: '1px solid rgba(100,116,139,0.25)' }}>
                <img
                  src="/owner.webp"
                  alt={brandDNA.team.founder.name}
                  className="w-14 h-14 object-cover flex-shrink-0"
                  style={{ objectPosition: '50% 10%' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div>
                  <div className="font-heading font-bold text-white uppercase text-sm">{brandDNA.company.name.toUpperCase()}</div>
                  <p className="text-cool text-xs leading-relaxed mt-0.5">{brandDNA.team.founder.name}, {brandDNA.team.founder.title}.</p>
                </div>
              </div>

              {/* Back to blog */}
              <div className="mt-8">
                <Link to="/blog" className="flex items-center gap-2 text-gold text-sm font-bold hover:gap-3 transition-all hover:text-white">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to all articles
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="flex flex-col gap-5">
              {/* Sticky quote rail */}
              <div className="sticky-rail flex flex-col gap-5">
                <QuoteForm formId={`blog-${post.slug}`} title="Get Your Free Estimate" />

                {/* CTA card */}
              <div className="p-6 text-center bg-navy-slate" style={{ border: '1px solid rgb(var(--accent) / 0.2)', borderTop: '2px solid rgb(var(--accent))' }}>
                <div className="font-heading font-bold text-white uppercase text-lg mb-2">
                  FREE ROOF INSPECTION
                </div>
                <p className="text-cool text-xs leading-relaxed mb-5">
                  Get a professional assessment of your roof. Written report included, zero obligation.
                </p>
                <Link
                  to="/contact"
                  className="btn-gold block w-full font-heading font-bold text-sm uppercase px-5 py-3 tracking-widest text-navy"
                >
                  BOOK INSPECTION →
                </Link>
              </div>

              {/* Contact info */}
              <div className="p-5 bg-navy-slate" style={{ border: '1px solid rgba(100,116,139,0.25)' }}>
                <div className="font-heading font-bold text-white uppercase text-sm tracking-wider mb-4">CALL US DIRECT</div>
                <a href={`tel:${brandDNA.contact.phoneTelLink}`} className="flex items-center gap-3 group mb-3">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgb(var(--accent-light)) 0%, rgb(var(--accent)) 40%, rgb(var(--accent-dark)) 65%, rgb(var(--accent-light)) 100%)' }}>
                    <svg className="w-3.5 h-3.5" style={{ color: '#ffffff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="font-heading font-bold text-white group-hover:text-gold transition-colors">{brandDNA.contact.phone}</span>
                </a>
                <p className="text-steel text-xs leading-relaxed">Emergency line available 24/7.</p>
              </div>

              {/* Related posts */}
              <div>
                <div className="font-heading font-bold text-white uppercase text-sm tracking-wider mb-4">MORE ARTICLES</div>
                <div className="flex flex-col gap-3">
                  {related.map((p) => (
                    <Link key={p.slug} to={`/blog/${p.slug}`} className="group flex items-start gap-3 p-3 bg-navy-slate" style={{ border: '1px solid rgba(100,116,139,0.25)' }}>
                      <div className="w-14 h-14 overflow-hidden flex-shrink-0">
                        <img
                          src={p.cover}
                          alt={p.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                          onError={(e) => { e.target.src = '/work/project1.webp'; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gold">{p.category}</span>
                        <div className="font-heading font-bold text-white text-xs uppercase leading-tight mt-0.5 group-hover:text-gold transition-colors line-clamp-2">{p.title}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
