export type GNewsHeadline = {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  imageUrl?: string;
};

type GNewsResponse = {
  articles?: Array<{
    title?: string;
    description?: string;
    url?: string;
    publishedAt?: string;
    image?: string;
    source?: { name?: string };
  }>;
};

const publisherKeywords = [
  "times",
  "india",
  "hindu",
  "reuters",
  "bbc",
  "cnn",
  "ndtv",
  "post",
  "express",
  "today",
  "guardian",
  "mint",
  "hindustan",
];

function cleanHeadline(rawTitle: string) {
  const title = rawTitle.trim();
  const pieces = title.split(/\s[-|]\s/);

  if (pieces.length < 2) {
    return title;
  }

  const trailingChunk = pieces[pieces.length - 1].toLowerCase();
  const isPublisherTag = publisherKeywords.some((keyword) => trailingChunk.includes(keyword));

  return isPublisherTag ? pieces.slice(0, -1).join(" - ").trim() : title;
}

function formatPublishedAt(value: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export async function fetchGNewsHeadlines(limit = 8): Promise<GNewsHeadline[]> {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    return [];
  }

  const params = new URLSearchParams({
    country: "in",
    lang: "en",
    max: String(Math.min(Math.max(limit, 1), 20)),
    apikey: apiKey,
  });

  try {
    const response = await fetch(`https://gnews.io/api/v4/top-headlines?${params.toString()}`, {
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as GNewsResponse;

    const seen = new Set<string>();

    return (payload.articles ?? [])
      .map((article) => ({
        title: cleanHeadline(article.title ?? ""),
        description: article.description ?? "",
        url: article.url ?? "",
        publishedAt: formatPublishedAt(article.publishedAt ?? ""),
        imageUrl: article.image ?? "",
      }))
      .filter((article) => {
        const dedupeKey = `${article.title.toLowerCase()}|${article.url}`;
        if (!article.title || !article.url || seen.has(dedupeKey)) {
          return false;
        }

        seen.add(dedupeKey);
        return true;
      });
  } catch {
    return [];
  }
}
