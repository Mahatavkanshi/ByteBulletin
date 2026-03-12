import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type { VideoStory } from "@/lib/news-data";
import { getHomepageVideos, getVideoStories } from "@/lib/content";
import { getYoutubeEmbedUrl, getYoutubeThumbnailUrl } from "@/lib/video-utils";

export const metadata: Metadata = {
  title: "Video Bulletin | Byte Bulletin",
  description: "Watch Byte Bulletin video explainers and daily visual updates.",
};

type VideosPageProps = {
  searchParams?: Promise<{ source?: string; category?: string }>;
};

function sourceLabel(video: VideoStory) {
  return video.source?.trim() || "Byte Bulletin";
}

function sourceKey(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function categoryKey(video: VideoStory) {
  return video.category?.trim() || "general";
}

function categoryLabel(key: string) {
  return key
    .split("-")
    .filter(Boolean)
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function buildVideosHref(source: string, category: string) {
  const params = new URLSearchParams();

  if (source !== "all") {
    params.set("source", source);
  }

  if (category !== "all") {
    params.set("category", category);
  }

  const query = params.toString();
  return query ? `/videos?${query}` : "/videos";
}

export default async function VideosPage({ searchParams }: VideosPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const [{ featuredVideo }, videos] = await Promise.all([getHomepageVideos(), getVideoStories()]);
  const selectedSourceKey = typeof resolvedSearchParams.source === "string" ? resolvedSearchParams.source : "all";
  const selectedCategoryKey = typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : "all";

  const sourceFilters = [
    { key: "all", label: "All" },
    ...videos.reduce<Array<{ key: string; label: string }>>((filters, video) => {
      const label = sourceLabel(video);
      const key = sourceKey(label);

      if (!filters.some((filter) => filter.key === key)) {
        filters.push({ key, label });
      }

      return filters;
    }, []),
  ];

  const activeSourceKey = sourceFilters.some((filter) => filter.key === selectedSourceKey) ? selectedSourceKey : "all";

  const categoryFilters = [
    { key: "all", label: "All" },
    ...videos.reduce<Array<{ key: string; label: string }>>((filters, video) => {
      const key = categoryKey(video);

      if (!filters.some((filter) => filter.key === key)) {
        filters.push({ key, label: categoryLabel(key) });
      }

      return filters;
    }, []),
  ];

  const activeCategoryKey = categoryFilters.some((filter) => filter.key === selectedCategoryKey)
    ? selectedCategoryKey
    : "all";

  const sourceFilteredVideos =
    activeSourceKey === "all"
      ? videos
      : videos.filter((video) => sourceKey(sourceLabel(video)) === activeSourceKey);

  const filteredVideos =
    activeCategoryKey === "all"
      ? sourceFilteredVideos
      : sourceFilteredVideos.filter((video) => categoryKey(video) === activeCategoryKey);

  const pageFeaturedVideo = filteredVideos[0] ?? featuredVideo;
  const visibleVideos = filteredVideos.length > 0 ? filteredVideos : [pageFeaturedVideo];
  const embedUrl = getYoutubeEmbedUrl(pageFeaturedVideo.youtubeUrl);
  const quickPicks = visibleVideos
    .filter((video) => video.youtubeUrl !== pageFeaturedVideo.youtubeUrl)
    .slice(0, 4);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 border-b border-border pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Byte Bulletin</p>
        <h1 className="mt-2 text-4xl">Video Bulletin</h1>
        <p className="mt-2 text-muted">Television-style explainers auto-updated from selected YouTube news channels.</p>
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Source</span>
            {sourceFilters.map((filter) => {
              const isActive = filter.key === activeSourceKey;

              return (
                <Link
                  key={filter.key}
                  href={buildVideosHref(filter.key, activeCategoryKey)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                    isActive ? "bg-brand text-brand-soft" : "border border-border text-muted hover:text-brand"
                  }`}
                >
                  {filter.label}
                </Link>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Category</span>
            {categoryFilters.map((filter) => {
              const isActive = filter.key === activeCategoryKey;

              return (
                <Link
                  key={filter.key}
                  href={buildVideosHref(activeSourceKey, filter.key)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                    isActive ? "bg-brand text-brand-soft" : "border border-border text-muted hover:text-brand"
                  }`}
                >
                  {filter.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <section className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <article className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="aspect-video bg-[#1e3242]">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={pageFeaturedVideo.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm font-semibold text-[#ecf5ff]">Video unavailable</div>
            )}
          </div>
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand">Featured</p>
            <h2 className="mt-2 text-3xl leading-tight">{pageFeaturedVideo.title}</h2>
            <p className="mt-2 text-sm text-muted">{pageFeaturedVideo.summary}</p>
            <p className="mt-3 text-xs text-muted">
              {sourceLabel(pageFeaturedVideo)} | {categoryLabel(categoryKey(pageFeaturedVideo))} | Published {pageFeaturedVideo.publishedAt}
            </p>
            <a
              href={pageFeaturedVideo.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-soft"
            >
              Open on YouTube
            </a>
          </div>
        </article>

        <aside className="space-y-4 rounded-xl border border-border bg-surface p-5">
          <h3 className="text-xl">Quick Picks</h3>
          {quickPicks.map((video) => (
            <a key={video.slug} href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="block border-b border-border pb-3 last:border-none">
              <p className="text-sm font-semibold leading-snug">{video.title}</p>
              <p className="mt-1 text-xs text-muted">
                {sourceLabel(video)} | {categoryLabel(categoryKey(video))} | {video.publishedAt}
              </p>
            </a>
          ))}
        </aside>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 border-b border-border pb-2 text-2xl">All Videos</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleVideos.map((video) => {
            const thumbnail = getYoutubeThumbnailUrl(video.youtubeUrl);
            return (
              <article key={video.slug} className="overflow-hidden rounded-lg border border-border bg-surface">
                <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="relative aspect-video bg-[#dae5ef]">
                    {thumbnail ? (
                      <Image
                        src={thumbnail}
                        alt={video.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-semibold text-[#3f5567]">No preview</div>
                    )}
                    <span className="absolute bottom-2 left-2 rounded bg-black/75 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                      Watch
                    </span>
                  </div>
                </a>
                <div className="p-4">
                  <h3 className="text-lg leading-tight">{video.title}</h3>
                  <p className="mt-2 text-sm text-muted">{video.summary}</p>
                  <p className="mt-2 text-xs text-muted">
                    {sourceLabel(video)} | {categoryLabel(categoryKey(video))} | {video.publishedAt}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="mt-10">
        <Link href="/" className="text-sm font-semibold text-brand hover:underline">
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
