import type { Metadata } from 'next';
import { BLOG_POSTS } from '@/lib/data/blog';
import { AdSlot } from '@/components/common/AdSlot';

interface BlogPageProps {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { country } = await params;
  return {
    title: 'CatchThePrice Blog — Gaming, GPUs, CPUs, Phones & Buying Guides',
    description: 'Fresh buying guides, launch explainers and price-focused tech coverage for gaming laptops, GPUs, CPUs, phones and more.',
    alternates: { canonical: `https://catchtheprice.com/${country}/blog` },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { country } = await params;

  return (
    <div className="min-h-screen bg-[#071015] text-[#F8FAFC]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-[#00D27A]/25 bg-[#00D27A]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#00D27A]">
            CatchThePrice Editorial
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight">
            Smarter tech buying, without the noise.
          </h1>
          <p className="mt-4 text-sm sm:text-base leading-7 text-[#94A3B8] max-w-2xl">
            Original buying guides and market explainers focused on what shoppers actually need to know before spending money. Confirmed facts are separated from rumors, and fast-moving prices are always treated as time-sensitive.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {BLOG_POSTS.map((post, index) => (
            <article key={post.slug} className="group overflow-hidden rounded-3xl border border-[#162633] bg-[#091217]">
              <a href={`/${country}/blog/${post.slug}`} className="block">
                <div className="aspect-[16/9] overflow-hidden bg-[#0B141B]">
                  <img
                    src={post.imageUrl}
                    alt={post.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading={index < 3 ? 'eager' : 'lazy'}
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3 text-[11px]">
                    <span className="font-bold uppercase tracking-wider text-[#00D27A]">{post.category}</span>
                    <span className="text-[#64748B]">{post.readTime}</span>
                  </div>
                  <h2 className="mt-3 text-lg sm:text-xl font-extrabold leading-snug group-hover:text-[#00D27A] transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#94A3B8]">{post.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between text-xs">
                    <span className="text-[#64748B]">Updated {new Date(post.updatedAt).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="font-bold text-[#F8FAFC] group-hover:text-[#00D27A]">Read article →</span>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <AdSlot slotId="blog-index-after-grid" format="banner" />
        </div>
      </section>
    </div>
  );
}
