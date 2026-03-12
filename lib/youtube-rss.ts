import type { VideoStory } from "@/lib/news-data";
import { getYoutubeVideoId } from "@/lib/video-utils";

const defaultChannelIds = ["UCNye-wNBqNL5ZzHSJj3l8Bg", "UCknLrEdhRCp1aegoMqRaCZg"];

function getConfiguredChannelIds() {
  const configuredIds = process.env.YOUTUBE_NEWS_CHANNEL_IDS
    ?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return configuredIds && configuredIds.length > 0 ? configuredIds : defaultChannelIds;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function decodeXml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTag(block: string, tag: string) {
  const match = block.match(new RegExp(`<${escapeRegExp(tag)}>([\\s\\S]*?)<\\/${escapeRegExp(tag)}>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

function extractAlternateLink(block: string) {
  const match = block.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"[^>]*\/>/i);
  return match ? decodeXml(match[1]) : "";
}

function toSlug(title: string, videoId: string) {
  return `${title}-${videoId}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 110);
}

function formatPublishedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Updated recently";
  }

  return date.toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function summaryFromDescription(description: string, channelName: string) {
  if (!description) {
    return `${channelName} daily video update.`;
  }

  const firstParagraph = description.split("\n").find((line) => line.trim().length > 0) || description;
  const cleanText = firstParagraph.trim();

  return cleanText.length > 170 ? `${cleanText.slice(0, 167)}...` : cleanText;
}

type ParsedVideo = VideoStory & {
  publishedMs: number;
};

function parseFeed(xmlText: string) {
  const entryBlocks = [...xmlText.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match) => match[1]);

  const parsedVideos: ParsedVideo[] = [];

  for (const block of entryBlocks) {
    const videoId = extractTag(block, "yt:videoId");
    const title = extractTag(block, "title");
    const publishedRaw = extractTag(block, "published");
    const description = extractTag(block, "media:description");
    const channelName = extractTag(block, "name") || "News Channel";
    const alternateUrl = extractAlternateLink(block);
    const youtubeUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : alternateUrl;

    if (!videoId || !title || !youtubeUrl || /youtube\.com\/shorts\//i.test(alternateUrl)) {
      continue;
    }

    const validId = getYoutubeVideoId(youtubeUrl);
    if (!validId) {
      continue;
    }

    const publishedDate = new Date(publishedRaw);

    parsedVideos.push({
      title,
      slug: toSlug(title, validId),
      summary: summaryFromDescription(description, channelName),
      youtubeUrl,
      source: channelName,
      category: "world",
      publishedAt: formatPublishedAt(publishedRaw),
      publishedMs: Number.isNaN(publishedDate.getTime()) ? 0 : publishedDate.getTime(),
    });
  }

  return parsedVideos;
}

export async function fetchYouTubeNewsVideos(limit = 12): Promise<VideoStory[]> {
  const channelIds = getConfiguredChannelIds();

  const feedResponses = await Promise.all(
    channelIds.map(async (channelId) => {
      try {
        const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
          next: { revalidate: 3600 },
        });

        if (!response.ok) {
          return "";
        }

        return response.text();
      } catch {
        return "";
      }
    }),
  );

  const parsedVideos = feedResponses.flatMap((xmlText) => (xmlText ? parseFeed(xmlText) : []));

  const uniqueByVideoId = new Map<string, ParsedVideo>();

  for (const video of parsedVideos) {
    const videoId = getYoutubeVideoId(video.youtubeUrl);
    if (!videoId || uniqueByVideoId.has(videoId)) {
      continue;
    }

    uniqueByVideoId.set(videoId, video);
  }

  return [...uniqueByVideoId.values()]
    .sort((a, b) => b.publishedMs - a.publishedMs)
    .slice(0, limit)
    .map((video) => ({
      title: video.title,
      slug: video.slug,
      summary: video.summary,
      youtubeUrl: video.youtubeUrl,
      source: video.source,
      category: video.category,
      publishedAt: video.publishedAt,
      featured: video.featured,
    }));
}
