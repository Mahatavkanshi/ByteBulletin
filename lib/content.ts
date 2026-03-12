import { cache } from "react";
import {
  categories as fallbackCategories,
  factChecks,
  getCategoryStories,
  getFactChecks,
  getFeaturedStory,
  getFeaturedVideo,
  getLatestVideos,
  getRelatedStories,
  getStoryBySlug,
  getTopicBySlug,
  getTopicCards,
  getTopicTimeline,
  newsArticles,
  timelineEvents,
  topics,
  videoStories,
  type Category,
  type FactCheckItem,
  type NewsArticle,
  type SourceLink,
  type TimelineEvent,
  type Topic,
  type VideoStory,
} from "@/lib/news-data";
import { fetchGNewsHeadlines } from "@/lib/gnews";
import { isSanityConfigured, sanityClient } from "@/lib/sanity/client";
import {
  allArticlesQuery,
  allFactChecksQuery,
  allTopicsQuery,
  allVideosQuery,
  articleBySlugQuery,
  categoriesQuery,
  timelineEventsByTopicQuery,
  topicBySlugQuery,
} from "@/lib/sanity/queries";
import { fetchYouTubeNewsVideos } from "@/lib/youtube-rss";

const fallbackBreakingUpdates = [
  "Parliament panel seeks stronger digital safety norms for children",
  "Monsoon outlook revised upward for eastern coastal districts",
  "Global crude eases after shipping routes stabilise this week",
  "University consortium launches open scholarship portal for STEM",
];

type PortableBlock = {
  children?: Array<{ text?: string }>;
};

type CmsArticle = Omit<NewsArticle, "publishedAt" | "content" | "lastVerified"> & {
  publishedAt: string;
  lastVerified?: string;
  body?: PortableBlock[];
};

type CmsVideo = Omit<VideoStory, "publishedAt"> & {
  publishedAt: string;
};

type CmsFactCheck = Omit<FactCheckItem, "publishedAt"> & {
  publishedAt: string;
};

type CmsTopic = Topic;

type CmsTimelineEvent = Omit<TimelineEvent, "eventAt"> & {
  eventAt: string;
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

function toTextList(list: unknown): string[] {
  if (!Array.isArray(list)) {
    return [];
  }

  return list.map((value) => (typeof value === "string" ? value.trim() : "")).filter(Boolean);
}

function normalizeLinks(links: unknown): SourceLink[] {
  if (!Array.isArray(links)) {
    return [];
  }

  return links
    .map((link) => {
      if (!link || typeof link !== "object") {
        return null;
      }

      const { label, url } = link as { label?: string; url?: string };
      if (!label || !url) {
        return null;
      }

      return { label: label.trim(), url: url.trim() };
    })
    .filter((link): link is SourceLink => Boolean(link));
}

function formatPublishDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const datePart = date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

  const timePart = date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

  return `${datePart}, ${timePart} IST`;
}

function normalizeArticle(article: CmsArticle): NewsArticle {
  return {
    ...article,
    publishedAt: formatPublishDate(article.publishedAt),
    lastVerified: article.lastVerified ? formatDateTime(article.lastVerified) : undefined,
    whyItMatters: toTextList(article.whyItMatters),
    whatChanged: toTextList(article.whatChanged),
    whatNext: toTextList(article.whatNext),
    sixtySecondBrief: toTextList(article.sixtySecondBrief),
    sourceLinks: normalizeLinks(article.sourceLinks),
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

function normalizeFactCheck(factCheck: CmsFactCheck): FactCheckItem {
  return {
    ...factCheck,
    publishedAt: formatPublishDate(factCheck.publishedAt),
    evidence: normalizeLinks(factCheck.evidence),
  };
}

function normalizeTimelineEvent(event: CmsTimelineEvent): TimelineEvent {
  return {
    ...event,
    sourceLinks: normalizeLinks(event.sourceLinks),
    eventAt: formatDateTime(event.eventAt),
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
    return cmsArticles.length > 0 ? cmsArticles.map(normalizeArticle) : newsArticles;
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
    return cmsVideos.length > 0 ? cmsVideos.map(normalizeVideo) : videoStories;
  } catch {
    return videoStories;
  }
});

const fetchCmsFactChecks = cache(async (): Promise<FactCheckItem[]> => {
  if (!isSanityConfigured) {
    return factChecks;
  }

  try {
    const cmsFactChecks = await sanityClient.fetch<CmsFactCheck[]>(allFactChecksQuery);
    return cmsFactChecks.length > 0 ? cmsFactChecks.map(normalizeFactCheck) : factChecks;
  } catch {
    return factChecks;
  }
});

const fetchCmsTopics = cache(async (): Promise<Topic[]> => {
  if (!isSanityConfigured) {
    return topics;
  }

  try {
    const cmsTopics = await sanityClient.fetch<CmsTopic[]>(allTopicsQuery);
    return cmsTopics.length > 0 ? cmsTopics : topics;
  } catch {
    return topics;
  }
});

const fetchCmsTimelineByTopic = cache(async (slug: string): Promise<TimelineEvent[]> => {
  if (!isSanityConfigured) {
    return getTopicTimeline(slug);
  }

  try {
    const cmsTimeline = await sanityClient.fetch<CmsTimelineEvent[]>(timelineEventsByTopicQuery, { slug });
    return cmsTimeline.length > 0 ? cmsTimeline.map(normalizeTimelineEvent) : getTopicTimeline(slug);
  } catch {
    return getTopicTimeline(slug);
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
    return cmsArticle ? normalizeArticle(cmsArticle) : getStoryBySlug(slug);
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
  return merged.length > 0 ? merged : getLatestVideos(6);
}

export async function getFactCheckStories(limit = 5) {
  const checks = await fetchCmsFactChecks();
  return checks.slice(0, limit);
}

export async function getTopicCardsData(limit = 6) {
  const topicCards = await fetchCmsTopics();
  return topicCards.slice(0, limit);
}

export async function getTopicPageData(slug: string) {
  const [topicCards, timeline] = await Promise.all([fetchCmsTopics(), fetchCmsTimelineByTopic(slug)]);
  const fallbackTopic = getTopicBySlug(slug);
  const cmsTopic = topicCards.find((topic) => topic.slug === slug);

  if (cmsTopic) {
    return { topic: cmsTopic, timeline };
  }

  if (fallbackTopic) {
    return { topic: fallbackTopic, timeline: timeline.length > 0 ? timeline : getTopicTimeline(slug) };
  }

  return null;
}

export async function getTopicStories(slug: string, limit = 8) {
  const stories = await fetchCmsArticles();
  return stories.filter((story) => story.topic?.slug === slug).slice(0, limit);
}

export async function getPersonalizationSeed() {
  const [stories, topicCards, navCategories] = await Promise.all([fetchCmsArticles(), fetchCmsTopics(), fetchCmsCategories()]);

  return {
    stories: stories.slice(0, 18),
    topics: topicCards,
    categories: navCategories,
  };
}

export async function getAllSlugs() {
  const stories = await fetchCmsArticles();
  return stories.map((story) => story.slug);
}

export async function getCategorySlugs() {
  const navCategories = await fetchCmsCategories();
  return navCategories.map((category) => category.slug);
}

export async function getTopicSlugs() {
  const topicCards = await fetchCmsTopics();
  return topicCards.length > 0 ? topicCards.map((topic) => topic.slug) : getTopicCards().map((topic) => topic.slug);
}

export async function getTopicTimelineData(slug: string) {
  const timeline = await fetchCmsTimelineByTopic(slug);

  if (timeline.length > 0) {
    return timeline;
  }

  return timelineEvents.filter((event) => event.topicSlug === slug);
}
