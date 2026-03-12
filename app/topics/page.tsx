import type { Metadata } from "next";
import Link from "next/link";
import { getTopicCardsData } from "@/lib/content";

export const metadata: Metadata = {
  title: "Topics | Byte Bulletin",
  description: "Track ongoing developing stories through topic timelines and explainers.",
};

export default async function TopicsPage() {
  const topics = await getTopicCardsData(20);

  return (
    <main className="mx-auto max-w-[88rem] px-5 py-12 sm:px-7 lg:px-10">
      <div className="border-b border-border pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Byte Bulletin Desk</p>
        <h1 className="mt-2 text-5xl">Topic Timelines</h1>
        <p className="mt-2 text-muted">Follow complex stories through key updates, not isolated headlines.</p>
      </div>

      <section className="mt-10 grid auto-rows-fr gap-6 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <article key={topic.slug} className="flex h-full flex-col rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-3xl leading-tight">{topic.name}</h2>
            <p className="mt-3 text-base text-muted">{topic.summary}</p>
            <Link href={`/topic/${topic.slug}`} className="mt-auto inline-block pt-5 text-base font-semibold text-brand hover:underline">
              Open timeline
            </Link>
          </article>
        ))}
      </section>

      <div className="mt-8">
        <Link href="/" className="text-sm font-semibold text-brand hover:underline">
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
