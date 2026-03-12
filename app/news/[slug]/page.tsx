import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArticleAudio } from "@/components/article-audio";
import { getAllSlugs, getNavigationCategories, getRelated, getStory } from "@/lib/content";
import { resolveStoryImage } from "@/lib/news-data";

type NewsPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getStory(slug);

  if (!article) {
    return {
      title: "Story not found | Byte Bulletin",
    };
  }

  return {
    title: `${article.title} | Byte Bulletin`,
    description: article.summary,
  };
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { slug } = await params;
  const article = await getStory(slug);

  if (!article) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl">Story not found</h1>
        <Link href="/" className="mt-4 inline-block text-brand hover:underline">
          Back to home
        </Link>
      </main>
    );
  }

  const categories = await getNavigationCategories();
  const category = categories.find((item) => item.slug === article.category);
  const relatedStories = await getRelated(article.slug, article.category);
  const whyItMatters = article.whyItMatters ?? [];
  const whatChanged = article.whatChanged ?? [];
  const whatNext = article.whatNext ?? [];
  const quickBrief = article.sixtySecondBrief ?? [];
  const sourceLinks = article.sourceLinks ?? [];

  return (
    <main className="mx-auto max-w-[88rem] px-5 py-12 sm:px-7 lg:px-10">
      <article className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            {category?.name ?? "News"}
          </p>
          <h1 className="mt-3 text-5xl leading-tight sm:text-6xl">{article.title}</h1>
          <p className="mt-4 text-xl text-[#425668]">{article.summary}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
            <span>{article.author}</span>
            <span>|</span>
            <span>{article.location}</span>
            <span>|</span>
            <span>{article.publishedAt}</span>
            <span>|</span>
            <span>{article.readTime}</span>
          </div>
          {article.topic ? (
            <Link href={`/topic/${article.topic.slug}`} className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">
              Follow timeline: {article.topic.name}
            </Link>
          ) : null}

          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl border border-border">
            <Image src={resolveStoryImage(article)} alt={article.title} fill sizes="(max-width: 1024px) 100vw, 900px" className="object-cover" />
          </div>

          <section className="mt-10 rounded-xl border border-border bg-surface p-6 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-3xl">Context and Trust</h2>
              <span className="text-sm text-muted">{article.lastVerified || "Verification in progress"}</span>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand">Why it matters</p>
                <ul className="mt-2 space-y-1 text-base text-[#2d4152]">
                  {whyItMatters.length > 0 ? whyItMatters.map((point) => <li key={point}>- {point}</li>) : <li>- Context update will be added by the desk.</li>}
                </ul>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand">What changed</p>
                <ul className="mt-2 space-y-1 text-base text-[#2d4152]">
                  {whatChanged.length > 0 ? whatChanged.map((point) => <li key={point}>- {point}</li>) : <li>- New developments are being tracked.</li>}
                </ul>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand">What next</p>
                <ul className="mt-2 space-y-1 text-base text-[#2d4152]">
                  {whatNext.length > 0 ? whatNext.map((point) => <li key={point}>- {point}</li>) : <li>- Follow this story for official updates.</li>}
                </ul>
              </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-[1.4fr_1fr]">
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand">Read in 60 sec</p>
                <ul className="mt-2 space-y-1 text-base text-[#2d4152]">
                  {quickBrief.length > 0 ? quickBrief.map((point) => <li key={point}>- {point}</li>) : <li>- Brief points will be published shortly.</li>}
                </ul>
                <div className="mt-3">
                  <ArticleAudio title={article.title} summary={article.summary} brief={quickBrief} content={article.content} />
                </div>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand">Sources</p>
                <div className="mt-2 space-y-2 text-base">
                  {sourceLinks.length > 0 ? (
                    sourceLinks.map((source) => (
                      <a
                        key={source.url}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block font-semibold text-brand hover:underline"
                      >
                        {source.label}
                      </a>
                    ))
                  ) : (
                    <p className="text-muted">Primary references will appear after editorial verification.</p>
                  )}
                </div>
              </div>
            </div>
          </section>

            <div className="mt-10 space-y-6 text-xl leading-relaxed text-[#213242]">
              {article.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="text-3xl">More in this section</h2>
            <div className="mt-4 space-y-4">
              {relatedStories.length === 0 ? (
                <p className="text-base text-muted">More stories are coming soon.</p>
              ) : (
                relatedStories.map((story) => (
                  <article key={story.slug} className="border-b border-border pb-3 last:border-none last:pb-0">
                    <h3 className="text-xl leading-snug">{story.title}</h3>
                    <Link href={`/news/${story.slug}`} className="mt-2 inline-block text-base font-semibold text-brand hover:underline">
                      Read this story
                    </Link>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="text-2xl">Follow Byte Bulletin</h2>
            <p className="mt-3 text-base text-muted">
              Get verified updates every morning and evening with zero paywall.
            </p>
            <Link href="/" className="mt-4 inline-block rounded-full bg-brand px-5 py-2.5 text-base font-semibold text-brand-soft">
              Go to homepage
            </Link>
          </section>
        </aside>
      </article>
    </main>
  );
}
