import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCategorySlugs, getNavigationCategories, getStoriesByCategory } from "@/lib/content";
import { resolveStoryImage } from "@/lib/news-data";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getNavigationCategories();
  const category = categories.find((item) => item.slug === slug);

  return {
    title: category ? `${category.name} News | Byte Bulletin` : "Category | Byte Bulletin",
  };
}

export async function generateStaticParams() {
  const slugs = await getCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = await getNavigationCategories();
  const category = categories.find((item) => item.slug === slug);
  const stories = await getStoriesByCategory(slug);

  if (!category) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl">Category not found</h1>
        <Link href="/" className="mt-4 inline-block text-brand hover:underline">
          Back to home
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-b border-border pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: category.accent }}>
          Byte Bulletin Section
        </p>
        <h1 className="mt-2 text-4xl">{category.name}</h1>
      </div>

      <div className="mt-8 grid gap-5">
        {stories.map((story) => (
          <article key={story.slug} className="rounded-lg border border-border bg-surface p-5 shadow-sm">
            <div className="relative aspect-[16/8] overflow-hidden rounded-lg border border-border">
              <Image src={resolveStoryImage(story)} alt={story.title} fill sizes="(max-width: 1280px) 100vw, 900px" className="object-cover" />
            </div>
            <h2 className="mt-4 text-2xl leading-tight">{story.title}</h2>
            <p className="mt-3 text-[#425668]">{story.summary}</p>
            <div className="mt-4 text-sm text-muted">
              {story.author} | {story.location} | {story.publishedAt}
            </div>
            <Link href={`/news/${story.slug}`} className="mt-4 inline-block text-sm font-semibold text-brand hover:underline">
              Read full report
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
