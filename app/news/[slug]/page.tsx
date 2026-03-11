import type { Metadata } from "next";
import Link from "next/link";
import { categories, getRelatedStories, getStoryBySlug } from "@/lib/news-data";

type NewsPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getStoryBySlug(slug);

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

export default async function NewsPage({ params }: NewsPageProps) {
  const { slug } = await params;
  const article = getStoryBySlug(slug);

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

  const category = categories.find((item) => item.slug === article.category);
  const relatedStories = getRelatedStories(article.slug, article.category);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <article className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            {category?.name ?? "News"}
          </p>
          <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{article.title}</h1>
          <p className="mt-4 text-lg text-[#425668]">{article.summary}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
            <span>{article.author}</span>
            <span>|</span>
            <span>{article.location}</span>
            <span>|</span>
            <span>{article.publishedAt}</span>
            <span>|</span>
            <span>{article.readTime}</span>
          </div>

          <div className="mt-7 h-64 rounded-xl border border-border bg-gradient-to-br from-[#f7dfdb] via-[#f5ede3] to-[#dce9f5]" />

          <div className="mt-8 space-y-5 text-lg leading-relaxed text-[#213242]">
            {article.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="text-2xl">More in this section</h2>
            <div className="mt-4 space-y-4">
              {relatedStories.length === 0 ? (
                <p className="text-sm text-muted">More stories are coming soon.</p>
              ) : (
                relatedStories.map((story) => (
                  <article key={story.slug} className="border-b border-border pb-3 last:border-none last:pb-0">
                    <h3 className="text-base leading-snug">{story.title}</h3>
                    <Link href={`/news/${story.slug}`} className="mt-1 inline-block text-sm font-semibold text-brand hover:underline">
                      Read this story
                    </Link>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="text-xl">Follow Byte Bulletin</h2>
            <p className="mt-2 text-sm text-muted">
              Get verified updates every morning and evening with zero paywall.
            </p>
            <Link href="/" className="mt-3 inline-block rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-soft">
              Go to homepage
            </Link>
          </section>
        </aside>
      </article>
    </main>
  );
}
