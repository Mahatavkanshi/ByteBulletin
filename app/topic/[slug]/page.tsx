import type { Metadata } from "next";
import Link from "next/link";
import { getTopicPageData, getTopicSlugs, getTopicStories } from "@/lib/content";

type TopicPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topicData = await getTopicPageData(slug);

  return {
    title: topicData ? `${topicData.topic.name} | Byte Bulletin` : "Topic | Byte Bulletin",
    description: topicData?.topic.summary,
  };
}

export async function generateStaticParams() {
  const slugs = await getTopicSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topicData = await getTopicPageData(slug);

  if (!topicData) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl">Topic not found</h1>
        <Link href="/topics" className="mt-4 inline-block text-brand hover:underline">
          Browse all topics
        </Link>
      </main>
    );
  }

  const relatedStories = await getTopicStories(slug, 8);

  return (
    <main className="mx-auto max-w-[88rem] px-5 py-12 sm:px-7 lg:px-10">
      <div className="border-b border-border pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Topic Timeline</p>
        <h1 className="mt-2 text-5xl">{topicData.topic.name}</h1>
        <p className="mt-2 max-w-3xl text-muted">{topicData.topic.summary}</p>
      </div>

      <section className="mt-10 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <h2 className="text-3xl">Timeline</h2>
          {topicData.timeline.length === 0 ? (
            <p className="text-base text-muted">Timeline updates are being prepared.</p>
          ) : (
            topicData.timeline.map((event) => (
              <article key={event.slug} className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wider text-brand">{event.eventAt}</p>
                <h3 className="mt-2 text-3xl leading-tight">{event.title}</h3>
                <p className="mt-3 text-base text-[#2d4152]">{event.update}</p>
                <div className="mt-4 space-y-2">
                  {event.sourceLinks.map((source) => (
                    <a
                      key={`${event.slug}-${source.url}`}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-base font-semibold text-brand hover:underline"
                    >
                      Source: {source.label}
                    </a>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>

        <aside className="space-y-5 rounded-xl border border-border bg-surface p-6">
          <h2 className="text-2xl">Related Coverage</h2>
          {relatedStories.length === 0 ? (
            <p className="text-base text-muted">Related stories will appear here soon.</p>
          ) : (
            relatedStories.map((story) => (
              <article key={story.slug} className="border-b border-border pb-3 last:border-none">
                <h3 className="text-xl leading-snug">{story.title}</h3>
                <p className="mt-2 text-sm text-muted">{story.publishedAt}</p>
                <Link href={`/news/${story.slug}`} className="mt-2 inline-block text-base font-semibold text-brand hover:underline">
                  Read story
                </Link>
              </article>
            ))
          )}
        </aside>
      </section>
    </main>
  );
}
