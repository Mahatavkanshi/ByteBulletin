import { cache } from "react";
import {
  categories as fallbackCategories,
  getCategoryStories,
  getFeaturedStory,
  getRelatedStories,
  getStoryBySlug,
  newsArticles,
  type Category,
  type NewsArticle,
} from "@/lib/news-data";
import { isSanityConfigured, sanityClient } from "@/lib/sanity/client";
import { allArticlesQuery, articleBySlugQuery, categoriesQuery } from "@/lib/sanity/queries";

type PortableBlock = {
  children?: Array<{ text?: string }>;
};

type CmsArticle = Omit<NewsArticle, "publishedAt" | "content"> & {
  publishedAt: string;
  body?: PortableBlock[];
};

function toParagraphs(blocks: PortableBlock[] | undefined, summary: string) {
  if (!blocks || blocks.length === 0) {
    return [summary];
  }

  const paragraphs = blocks
    .map((block) => block.children?.map((child) => child.text || "").join("").trim())
    .filter((text): text is string => Boolean(text));

  return paragraphs.length > 0 ? paragraphs : [summary];
}

function formatPublishDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function normalizeArticle(article: CmsArticle): NewsArticle {
  return {
    ...article,
    publishedAt: formatPublishDate(article.publishedAt),
    content: toParagraphs(article.body, article.summary),
  };
}

const fetchCmsCategories = cache(async (): Promise<Category[]> => {
  if (!isSanityConfigured) {
    return fallbackCategories;
  }

  const cmsCategories = await sanityClient.fetch<Category[]>(categoriesQuery);
  return cmsCategories.length > 0 ? cmsCategories : fallbackCategories;
});

const fetchCmsArticles = cache(async (): Promise<NewsArticle[]> => {
  if (!isSanityConfigured) {
    return newsArticles;
  }

  const cmsArticles = await sanityClient.fetch<CmsArticle[]>(allArticlesQuery);

  if (cmsArticles.length === 0) {
    return newsArticles;
  }

  return cmsArticles.map(normalizeArticle);
});

export async function getNavigationCategories() {
  return fetchCmsCategories();
}

export async function getHomepageStories() {
  const stories = await fetchCmsArticles();

  return {
    featured: stories.find((story) => story.featured) ?? stories[0] ?? getFeaturedStory(),
    latest: stories.slice(0, 5),
    trending: stories.filter((story) => story.trending).slice(0, 4),
    categories: await fetchCmsCategories(),
  };
}

export async function getStory(slug: string) {
  if (!isSanityConfigured) {
    return getStoryBySlug(slug);
  }

  const cmsArticle = await sanityClient.fetch<CmsArticle | null>(articleBySlugQuery, { slug });

  if (!cmsArticle) {
    return getStoryBySlug(slug);
  }

  return normalizeArticle(cmsArticle);
}

export async function getStoriesByCategory(slug: string) {
  const stories = await fetchCmsArticles();
  const filtered = stories.filter((story) => story.category === slug);
  return filtered.length > 0 ? filtered : getCategoryStories(slug);
}

export async function getRelated(slug: string, category: string) {
  const stories = await fetchCmsArticles();
  const related = stories.filter((story) => story.slug !== slug && story.category === category).slice(0, 3);
  return related.length > 0 ? related : getRelatedStories(slug, category);
}

export async function getSearchStories() {
  return fetchCmsArticles();
}

export async function getAllSlugs() {
  const stories = await fetchCmsArticles();
  return stories.map((story) => story.slug);
}

export async function getCategorySlugs() {
  const navCategories = await fetchCmsCategories();
  return navCategories.map((category) => category.slug);
}
