import Image from "next/image";
import Link from "next/link";
import { getSearchStories } from "@/lib/content";
import { resolveStoryImage } from "@/lib/news-data";

export default async function SearchPage() {
  const stories = await getSearchStories();

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl">Search</h1>
      <p className="mt-2 text-muted">Start free with this manual index. Upgrade later to Algolia or Meilisearch.</p>

      <div className="mt-8 grid gap-5">
        {stories.map((article) => (
          <article key={article.slug} className="rounded-lg border border-border bg-surface p-5 shadow-sm">
            <div className="relative aspect-[16/7] overflow-hidden rounded-lg border border-border">
              <Image src={resolveStoryImage(article)} alt={article.title} fill sizes="(max-width: 1280px) 100vw, 900px" className="object-cover" />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand">{article.category}</p>
            <h2 className="mt-1 text-2xl leading-tight">{article.title}</h2>
            <p className="mt-2 text-base text-muted">{article.summary}</p>
            <Link href={`/news/${article.slug}`} className="mt-3 inline-block text-base font-semibold text-brand hover:underline">
              Open story
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
