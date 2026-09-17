import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, getBlogPost } from '@/lib/data/blog';
import { AdSlot } from '@/components/common/AdSlot';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, ExternalLink, ShieldCheck } from 'lucide-react';

interface ArticlePageProps {
  params: Promise<{ country: string; slug: string }>;
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { country, slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const url = `https://catchtheprice.com/${country}/blog/${post.slug}`;
  return {
    title: `${post.title} | CatchThePrice`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url,
      images: [{ url: post.imageUrl, alt: post.imageAlt }],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { country, slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((item) => item.slug !== post.slug).slice(0, 3);
  const jumpLinks = post.sections
    .map((section, index) => ({ heading: section.heading, index }))
    .filter((item) => Boolean(item.heading));

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    image: [post.imageUrl],
    author: { '@type': 'Organization', name: 'CatchThePrice Editorial' },
    publisher: { '@type': 'Organization', name: 'CatchThePrice', url: 'https://catchtheprice.com' },
    mainEntityOfPage: `https://catchtheprice.com/${country}/blog/${post.slug}`,
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-[#102027]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <section className="bg-[#071015] text-white border-b border-[#17303A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <a href={`/${country}/blog`} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#AEBBC1] hover:text-white">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Guides
          </a>

          <header className="mt-5 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px]">
              <span className="rounded-full border border-[#1D4D3C] bg-[#0E2A22] px-2.5 py-1 font-extrabold uppercase tracking-wider text-[#63E6AE]">{post.category}</span>
              <span className="inline-flex items-center gap-1 text-[#AEBBC1]"><Clock3 className="w-3.5 h-3.5" /> {post.readTime}</span>
              <span className="text-[#81949D]">Updated {new Date(post.updatedAt).toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <h1 className="mt-4 text-3xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.04] tracking-tight">{post.title}</h1>
            <p className="mt-4 text-base sm:text-lg leading-8 text-[#B8C5CA] max-w-3xl">{post.excerpt}</p>

            <div className="mt-5 flex flex-wrap gap-2 text-[10px] sm:text-[11px] text-[#C8D4D8]">
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#17303A] bg-[#0A151A] px-2.5 py-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#63E6AE]" /> Time-sensitive claims sourced</span>
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#17303A] bg-[#0A151A] px-2.5 py-2"><ShieldCheck className="w-3.5 h-3.5 text-[#63E6AE]" /> Pricing treated as changeable</span>
            </div>
          </header>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <figure className="overflow-hidden rounded-[26px] border border-[#DDE7E3] bg-white shadow-[0_12px_34px_rgba(25,55,45,0.06)]">
          <img src={post.imageUrl} alt={post.imageAlt} className="w-full aspect-[16/9] object-cover" />
          <figcaption className="px-4 sm:px-5 py-3 text-[11px] leading-5 text-[#73858D] border-t border-[#EDF2F0]">{post.imageCaption}</figcaption>
        </figure>

        <div className="mt-6 grid lg:grid-cols-[220px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
          <aside className="lg:sticky lg:top-24 space-y-4">
            {jumpLinks.length > 0 && (
              <div className="rounded-2xl bg-white border border-[#DDE7E3] p-4">
                <div className="text-[10px] uppercase tracking-[0.16em] font-extrabold text-[#08784B]">In this guide</div>
                <nav className="mt-3 space-y-2">
                  {jumpLinks.map((item) => (
                    <a key={item.index} href={`#section-${item.index}`} className="block text-xs leading-5 font-semibold text-[#60727A] hover:text-[#08784B]">{item.heading}</a>
                  ))}
                </nav>
              </div>
            )}

            <div className="rounded-2xl bg-white border border-[#DDE7E3] p-4 text-[11px] leading-5 text-[#73858D]">
              <div className="font-extrabold text-[#102027]">Transparency</div>
              <p className="mt-1.5">We distinguish sourced facts from opinion and do not treat fast-moving prices as permanent.</p>
              <div className="mt-3 space-y-1.5 font-bold">
                <a href="/editorial-policy" className="block text-[#08784B]">Editorial policy →</a>
                <a href="/data-sources" className="block text-[#08784B]">Data sources →</a>
              </div>
            </div>
          </aside>

          <article className="min-w-0">
            <div className="rounded-2xl border border-[#F0D9A5] bg-[#FFF9EB] px-4 py-3 text-xs leading-6 text-[#6B5A30]">
              <strong className="text-[#5B4517]">Price note:</strong> Product prices and availability can change quickly. Use the article for buying context and verify the current retailer price before purchasing.
            </div>

            <div className="mt-6">
              <AdSlot slotId={`blog-${post.slug}-top`} format="banner" />
            </div>

            <div className="mt-6 space-y-5 sm:space-y-6">
              {post.sections.map((section, index) => (
                <section id={`section-${index}`} key={`${post.slug}-${index}`} className="rounded-3xl bg-white border border-[#DDE7E3] p-5 sm:p-7 scroll-mt-28">
                  {section.heading && <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#102027]">{section.heading}</h2>}
                  <div className={section.heading ? 'mt-3 space-y-4' : 'space-y-4'}>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 48)} className="text-[15px] sm:text-base leading-7 sm:leading-8 text-[#52636B]">{paragraph}</p>
                    ))}
                  </div>

                  {section.bullets && (
                    <ul className="mt-4 space-y-2.5 rounded-2xl border border-[#E1EAE6] bg-[#F8FBF9] p-4 sm:p-5 text-sm text-[#52636B]">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0B8F58]" /><span>{bullet}</span></li>
                      ))}
                    </ul>
                  )}

                  {index === 1 && <div className="mt-5"><AdSlot slotId={`blog-${post.slug}-mid`} format="in-feed" /></div>}
                </section>
              ))}
            </div>

            <section className="mt-6 rounded-3xl border border-[#DDE7E3] bg-white p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0B8F58]" />
                <h2 className="text-lg font-extrabold text-[#102027]">Sources & verification</h2>
              </div>
              <p className="mt-2 text-xs leading-6 text-[#73858D]">We summarize and explain source material in our own words. Links below are provided so time-sensitive claims can be checked directly.</p>
              <ul className="mt-4 grid sm:grid-cols-2 gap-2.5">
                {post.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer nofollow" className="flex items-center justify-between gap-3 rounded-xl border border-[#DDE7E3] bg-[#F8FBF9] px-3 py-2.5 text-xs font-bold text-[#086C45] hover:border-[#BFD2CA]">
                      <span className="truncate">{source.label}</span><ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => <span key={tag} className="rounded-full border border-[#DDE7E3] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#73858D]">{tag}</span>)}
            </div>
          </article>
        </div>

        {related.length > 0 && (
          <section className="mt-10 sm:mt-12 pt-7 border-t border-[#DDE7E3]">
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] font-extrabold text-[#08784B]">Keep exploring</div>
                <h2 className="text-xl sm:text-2xl font-extrabold mt-1">Related buying guides</h2>
              </div>
              <a href={`/${country}/blog`} className="hidden sm:inline-flex items-center gap-1 text-xs font-extrabold text-[#086C45]">All guides <ArrowRight className="w-3.5 h-3.5" /></a>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((item) => (
                <article key={item.slug} className="group rounded-2xl bg-white border border-[#DDE7E3] overflow-hidden">
                  <a href={`/${country}/blog/${item.slug}`} className="block aspect-[16/9] overflow-hidden bg-[#EEF4F1]"><img src={item.imageUrl} alt={item.imageAlt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.025]" loading="lazy" /></a>
                  <div className="p-4">
                    <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#08784B]">{item.category}</div>
                    <a href={`/${country}/blog/${item.slug}`} className="block mt-1.5 text-sm font-extrabold leading-snug text-[#102027] group-hover:text-[#08784B] line-clamp-2">{item.title}</a>
                    <div className="mt-3 text-[11px] text-[#829198]">{item.readTime}</div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
