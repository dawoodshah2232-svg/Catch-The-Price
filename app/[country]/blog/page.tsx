import type { Metadata } from 'next';
import { BLOG_POSTS } from '@/lib/data/blog';
import { AdSlot } from '@/components/common/AdSlot';
import { ArrowRight, BookOpen, CheckCircle2, Clock3, ShieldCheck } from 'lucide-react';

interface BlogPageProps {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { country } = await params;
  return {
    title: 'CatchThePrice Guides — Gaming, GPUs, CPUs, Phones & Smarter Buying',
    description:
      'Practical buying guides, product explainers and price-focused tech coverage for gaming laptops, GPUs, CPUs, phones and more.',
    alternates: { canonical: `https://catchtheprice.com/${country}/blog` },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { country } = await params;
  const featured = BLOG_POSTS[0];
  const remaining = BLOG_POSTS.slice(1);
  const categories = [...new Set(BLOG_POSTS.map((post) => post.category))].slice(0, 7);

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-[#102027]">
      <section className="bg-[#071015] text-white border-b border-[#17303A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-7 lg:gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#1D4D3C] bg-[#0E2A22] px-3 py-1.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#63E6AE]">
                <BookOpen className="w-3.5 h-3.5" /> CatchThePrice Guides
              </span>
              <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] max-w-3xl">
                Buy smarter with clear, useful tech guidance.
              </h1>
              <p className="mt-4 text-sm sm:text-base leading-7 text-[#AEBBC1] max-w-2xl">
                Shopping-focused guides, product explainers and market context designed to help you compare options before you spend.
              </p>

              <div className="mt-5 flex flex-wrap gap-2 text-[10px] sm:text-[11px] text-[#C8D4D8]">
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#17303A] bg-[#0A151A] px-2.5 py-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#63E6AE]" /> Facts separated from rumors</span>
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#17303A] bg-[#0A151A] px-2.5 py-2"><ShieldCheck className="w-3.5 h-3.5 text-[#63E6AE]" /> Sources shown on articles</span>
              </div>
            </div>

            <div className="rounded-[26px] border border-[#17303A] bg-[#0A151A] p-4 sm:p-5">
              <div className="text-[10px] uppercase tracking-[0.16em] font-extrabold text-[#63E6AE]">How our content works</div>
              <div className="mt-3 space-y-3 text-xs sm:text-sm text-[#C8D4D8]">
                <div className="flex items-start gap-3"><span className="mt-1 w-6 h-6 rounded-lg bg-[#0E2A22] border border-[#1D4D3C] text-[#63E6AE] flex items-center justify-center font-extrabold text-[10px]">1</span><p>We focus on real buying questions, not filler content.</p></div>
                <div className="flex items-start gap-3"><span className="mt-1 w-6 h-6 rounded-lg bg-[#0E2A22] border border-[#1D4D3C] text-[#63E6AE] flex items-center justify-center font-extrabold text-[10px]">2</span><p>Time-sensitive claims are checked against listed sources.</p></div>
                <div className="flex items-start gap-3"><span className="mt-1 w-6 h-6 rounded-lg bg-[#0E2A22] border border-[#1D4D3C] text-[#63E6AE] flex items-center justify-center font-extrabold text-[10px]">3</span><p>Prices are treated as changing data, never permanent facts.</p></div>
              </div>
              <div className="mt-4 flex gap-3 text-[11px] font-bold">
                <a href="/editorial-policy" className="text-[#63E6AE] hover:text-white">Editorial policy →</a>
                <a href="/data-sources" className="text-[#AEBBC1] hover:text-white">Data sources →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 sm:mb-8 scrollbar-none">
            <a href={`/${country}/blog`} className="shrink-0 rounded-xl bg-[#0B8F58] text-white px-3 py-2 text-[11px] font-extrabold">All guides</a>
            {categories.map((category) => (
              <span key={category} className="shrink-0 rounded-xl bg-white border border-[#DDE7E3] text-[#52636B] px-3 py-2 text-[11px] font-bold">{category}</span>
            ))}
          </div>
        )}

        {featured && (
          <section className="mb-8 sm:mb-10">
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] font-extrabold text-[#08784B]">Featured guide</div>
                <h2 className="text-xl sm:text-2xl font-extrabold mt-1">Start here</h2>
              </div>
            </div>

            <article className="group overflow-hidden rounded-[26px] bg-white border border-[#DDE7E3] shadow-[0_12px_34px_rgba(25,55,45,0.06)] grid md:grid-cols-[1.05fr_0.95fr]">
              <a href={`/${country}/blog/${featured.slug}`} className="block min-h-[230px] sm:min-h-[300px] bg-[#EEF4F1] overflow-hidden">
                <img src={featured.imageUrl} alt={featured.imageAlt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.025]" />
              </a>
              <div className="p-5 sm:p-7 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="font-extrabold uppercase tracking-wider text-[#08784B]">{featured.category}</span>
                  <span className="text-[#A0AEA9]">•</span>
                  <span className="inline-flex items-center gap-1 text-[#73858D]"><Clock3 className="w-3.5 h-3.5" /> {featured.readTime}</span>
                </div>
                <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold leading-tight text-[#102027] group-hover:text-[#08784B] transition-colors">{featured.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#60727A]">{featured.excerpt}</p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] text-[#829198]">Updated {new Date(featured.updatedAt).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <a href={`/${country}/blog/${featured.slug}`} className="inline-flex items-center gap-1.5 rounded-xl bg-[#F0F7F4] border border-[#CFE3DB] px-3 py-2 text-xs font-extrabold text-[#086C45] hover:bg-[#E6F4EE]">Read guide <ArrowRight className="w-3.5 h-3.5" /></a>
                </div>
              </div>
            </article>
          </section>
        )}

        <section>
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] font-extrabold text-[#08784B]">Latest</div>
              <h2 className="text-xl sm:text-2xl font-extrabold mt-1">More buying guides</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {remaining.map((post, index) => (
              <article key={post.slug} className="group overflow-hidden rounded-[22px] bg-white border border-[#DDE7E3] hover:border-[#BFD2CA] hover:shadow-[0_12px_30px_rgba(25,55,45,0.07)] transition-all flex flex-col">
                <a href={`/${country}/blog/${post.slug}`} className="block aspect-[16/9] overflow-hidden bg-[#EEF4F1]">
                  <img src={post.imageUrl} alt={post.imageAlt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.025]" loading={index < 2 ? 'eager' : 'lazy'} />
                </a>
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-3 text-[10px] sm:text-[11px]">
                    <span className="font-extrabold uppercase tracking-wider text-[#08784B]">{post.category}</span>
                    <span className="text-[#829198]">{post.readTime}</span>
                  </div>
                  <a href={`/${country}/blog/${post.slug}`} className="mt-2.5 block">
                    <h3 className="text-lg font-extrabold leading-snug text-[#102027] group-hover:text-[#08784B] transition-colors line-clamp-3">{post.title}</h3>
                  </a>
                  <p className="mt-2 text-sm leading-6 text-[#60727A] line-clamp-3">{post.excerpt}</p>
                  <div className="mt-auto pt-4 flex items-center justify-between gap-3 text-[11px]">
                    <span className="text-[#829198]">{new Date(post.updatedAt).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <a href={`/${country}/blog/${post.slug}`} className="font-extrabold text-[#086C45] inline-flex items-center gap-1">Read <ArrowRight className="w-3 h-3" /></a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-8 sm:mt-10">
          <AdSlot slotId="blog-index-after-grid" format="banner" />
        </div>
      </main>
    </div>
  );
}
