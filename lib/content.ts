import { cache } from "react";
import {
  categories as fallbackCategories,
  getFeaturedVideo,
  getLatestVideos,
  getCategoryStories,
  getFeaturedStory,
  getRelatedStories,
  getStoryBySlug,
  newsArticles,
  videoStories,
  type Category,
  type NewsArticle,
  type VideoStory,
} from "@/lib/news-data";
import { fetchGNewsHeadlines } from "@/lib/gnews";
import { fetchYouTubeNewsVideos } from "@/lib/youtube-rss";
import { isSanityConfigured, sanityClient } from "@/lib/sanity/client";
import { allArticlesQuery, allVideosQuery, articleBySlugQuery, categoriesQuery } from "@/lib/sanity/queries";

const fallbackBreakingUpdates = [
  "Parliament panel seeks stronger digital safety norms for children",
  "Monsoon outlook revised upward for eastern coastal districts",
  "Global crude eases after shipping routes stabilise this week",
  "University consortium launches open scholarship portal for STEM",
];

type PortableBlock = {
  children?: Array<{ text?: string }>;
};

type CmsArticle = Omit<NewsArticle, "publishedAt" | "content"> & {
  publishedAt: string;
  body?: PortableBlock[];
};

type CmsVideo = Omit<VideoStory, "publishedAt"> & {
  publishedAt: string;
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

function normalizeVideo(video: CmsVideo): VideoStory {
  return {
    ...video,
    source: video.source?.trim() || "Byte Bulletin",
    publishedAt: formatPublishDate(video.publishedAt),
  };
}

function uniqueVideos(videos: VideoStory[]) {
  const seen = new Set<string>();

  return videos.filter((video) => {
    const key = video.youtubeUrl;
    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

const fetchCmsCategories = cache(async (): Promise<Category[]> => {
  if (!isSanityConfigured) {
    return fallbackCategories;
  }

  try {
    const cmsCategories = await sanityClient.fetch<Category[]>(categoriesQuery);
    return cmsCategories.length > 0 ? cmsCategories : fallbackCategories;
  } catch {
    return fallbackCategories;
  }
});

const fetchCmsArticles = cache(async (): Promise<NewsArticle[]> => {
  if (!isSanityConfigured) {
    return newsArticles;
  }

  try {
    const cmsArticles = await sanityClient.fetch<CmsArticle[]>(allArticlesQuery);

    if (cmsArticles.length === 0) {
      return newsArticles;
    }

    return cmsArticles.map(normalizeArticle);
  } catch {
    return newsArticles;
  }
});

const fetchCmsVideos = cache(async (): Promise<VideoStory[]> => {
  if (!isSanityConfigured) {
    return videoStories;
  }

  try {
    const cmsVideos = await sanityClient.fetch<CmsVideo[]>(allVideosQuery);

    if (cmsVideos.length === 0) {
      return videoStories;
    }

    return cmsVideos.map(normalizeVideo);
  } catch {
    return videoStories;
  }
});

export async function getNavigationCategories() {
  return fetchCmsCategories();
}

export async function getHomepageStories() {
  const stories = await fetchCmsArticles();
  const liveUpdates = await fetchGNewsHeadlines(6);
  const breaking = liveUpdates.length > 0 ? liveUpdates.map((item) => item.title) : fallbackBreakingUpdates;

  return {
    featured: stories.find((story) => story.featured) ?? stories[0] ?? getFeaturedStory(),
    latest: stories.slice(0, 5),
    trending: stories.filter((story) => story.trending).slice(0, 4),
    categories: await fetchCmsCategories(),
    liveUpdates,
    breaking,
  };
}

export async function getHomepageVideos() {
  const [cmsVideos, autoVideos] = await Promise.all([fetchCmsVideos(), fetchYouTubeNewsVideos(10)]);
  const merged = uniqueVideos([...autoVideos, ...cmsVideos]);
  const featuredVideo = cmsVideos.find((video) => video.featured) ?? merged[0] ?? getFeaturedVideo();
  const latestVideos = uniqueVideos(merged.filter((video) => video.youtubeUrl !== featuredVideo.youtubeUrl)).slice(0, 3);

  return {
    featuredVideo,
    latestVideos,
  };
}

export async function getStory(slug: string) {
  if (!isSanityConfigured) {
    return getStoryBySlug(slug);
  }

  try {
    const cmsArticle = await sanityClient.fetch<CmsArticle | null>(articleBySlugQuery, { slug });
    if (!cmsArticle) {
      return getStoryBySlug(slug);
    }

    return normalizeArticle(cmsArticle);
  } catch {
    return getStoryBySlug(slug);
  }
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

export async function getVideoStories() {
  const [cmsVideos, autoVideos] = await Promise.all([fetchCmsVideos(), fetchYouTubeNewsVideos(20)]);
  const merged = uniqueVideos([...autoVideos, ...cmsVideos]);

  if (merged.length > 0) {
    return merged;
  }

  return getLatestVideos(6);
}

export async function getAllSlugs() {
  const stories = await fetchCmsArticles();
  return stories.map((story) => story.slug);
}

export async function getCategorySlugs() {
  const navCategories = await fetchCmsCategories();
  return navCategories.map((category) => category.slug);
}
