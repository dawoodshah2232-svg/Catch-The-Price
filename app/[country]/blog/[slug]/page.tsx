import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, getBlogPost } from '@/lib/data/blog';
import { AdSlot } from '@/components/common/AdSlot';

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
    <div className="min-h-screen bg-[#071015] text-[#F8FAFC]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <a href={`/${country}/blog`} className="text-xs font-semibold text-[#94A3B8] hover:text-[#00D27A]">← Back to Blog</a>

        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="rounded-full border border-[#00D27A]/25 bg-[#00D27A]/10 px-2.5 py-1 font-bold uppercase tracking-wider text-[#00D27A]">{post.category}</span>
            <span className="text-[#64748B]">{post.readTime}</span>
            <span className="text-[#64748B]">Updated {new Date(post.updatedAt).toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black leading-[1.08] tracking-tight">{post.title}</h1>
          <p className="mt-5 text-base sm:text-lg leading-8 text-[#94A3B8]">{post.excerpt}</p>
        </header>

        <figure className="mt-8 overflow-hidden rounded-3xl border border-[#162633] bg-[#091217]">
          <img src={post.imageUrl} alt={post.imageAlt} className="w-full aspect-[16/9] object-cover" />
          <figcaption className="px-4 py-3 text-[11px] leading-5 text-[#64748B]">{post.imageCaption}</figcaption>
        </figure>

        <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-xs leading-6 text-[#CBD5E1]">
          <strong className="text-amber-300">Price note:</strong> Product prices and availability can change quickly. Articles explain the market at the stated update date; always verify the live retailer price before buying.
        </div>

        <div className="mt-8">
          <AdSlot slotId={`blog-${post.slug}-top`} format="banner" />
        </div>

        <div className="mt-8 space-y-10">
          {post.sections.map((section, index) => (
            <section key={`${post.slug}-${index}`} className="space-y-4">
              {section.heading && <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{section.heading}</h2>}
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="text-[15px] sm:text-base leading-8 text-[#CBD5E1]">{paragraph}</p>
              ))}
              {section.bullets && (
                <ul className="space-y-2 rounded-2xl border border-[#162633] bg-[#091217] p-5 text-sm text-[#CBD5E1]">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00D27A]" /><span>{bullet}</span></li>
                  ))}
                </ul>
              )}
              {index === 1 && <AdSlot slotId={`blog-${post.slug}-mid`} format="in-feed" />}
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-3xl border border-[#162633] bg-[#091217] p-5 sm:p-6">
          <h2 className="text-lg font-extrabold">Sources & verification</h2>
          <p className="mt-2 text-xs leading-6 text-[#94A3B8]">We synthesize facts in our own words and link the material used to verify time-sensitive claims. We do not copy source articles.</p>
          <ul className="mt-4 space-y-3">
            {post.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noopener noreferrer nofollow" className="text-sm font-semibold text-[#00D27A] hover:underline">{source.label} ↗</a>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags.map((tag) => <span key={tag} className="rounded-full border border-[#162633] bg-[#091217] px-3 py-1.5 text-[11px] text-[#94A3B8]">{tag}</span>)}
        </div>
      </article>
    </div>
  );
}
