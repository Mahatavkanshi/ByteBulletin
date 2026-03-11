import Link from "next/link";
import { newsArticles } from "@/lib/news-data";

export default function SearchPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl">Search</h1>
      <p className="mt-2 text-muted">Start free with this manual index. Upgrade later to Algolia or Meilisearch.</p>

      <div className="mt-8 grid gap-4">
        {newsArticles.map((article) => (
          <article key={article.slug} className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">{article.category}</p>
            <h2 className="mt-1 text-2xl leading-tight">{article.title}</h2>
            <p className="mt-2 text-sm text-muted">{article.summary}</p>
            <Link href={`/news/${article.slug}`} className="mt-2 inline-block text-sm font-semibold text-brand hover:underline">
              Open story
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
