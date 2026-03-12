import Link from "next/link";
import Image from "next/image";
import {
  getFactCheckStories,
  getHomepageStories,
  getHomepageVideos,
  getStoriesByCategory,
  getTopicCardsData,
} from "@/lib/content";
import { categories as fallbackCategoryList, resolveStoryImage } from "@/lib/news-data";
import { getYoutubeEmbedUrl, getYoutubeThumbnailUrl } from "@/lib/video-utils";
import { getUtilityWidgets } from "@/lib/widgets";

export default async function Home() {
  const [
    { featured, latest, trending, categories, liveUpdates, breaking },
    { featuredVideo, latestVideos },
    factChecks,
    topicCards,
    utilityWidgets,
  ] = await Promise.all([
    getHomepageStories(),
    getHomepageVideos(),
    getFactCheckStories(3),
    getTopicCardsData(3),
    getUtilityWidgets(),
  ]);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const showFallbackLatest = liveUpdates.length === 0;
  const fallbackLatestStories = latest.filter((story) => story.slug !== featured.slug).slice(0, 4);

  const usedStorySlugs = new Set<string>([featured.slug]);
  if (showFallbackLatest) {
    fallbackLatestStories.forEach((story) => usedStorySlugs.add(story.slug));
  }

  const trendingStories = [] as typeof trending;
  for (const story of trending) {
    if (usedStorySlugs.has(story.slug)) {
      continue;
    }

    trendingStories.push(story);
    usedStorySlugs.add(story.slug);

    if (trendingStories.length === 4) {
      break;
    }
  }

  if (trendingStories.length < 4) {
    for (const story of latest) {
      if (usedStorySlugs.has(story.slug)) {
        continue;
      }

      trendingStories.push(story);
      usedStorySlugs.add(story.slug);

      if (trendingStories.length === 4) {
        break;
      }
    }
  }

  const categoryPool =
    categories.length >= 4
      ? categories
      : [...categories, ...fallbackCategoryList.filter((fallback) => !categories.some((category) => category.slug === fallback.slug))];

  const sectionHighlights = (
    await Promise.all(
      categoryPool.slice(0, 6).map(async (category) => {
        const stories = await getStoriesByCategory(category.slug);
        const uniqueStory = stories.find((story) => !usedStorySlugs.has(story.slug)) ?? stories[0];

        if (!uniqueStory) {
          return null;
        }

        return { category, story: uniqueStory };
      }),
    )
  ).filter((item) => item !== null);
  const featuredVideoEmbed = getYoutubeEmbedUrl(featuredVideo.youtubeUrl);
  const liveUpdateImageFallbacks = [
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1494412685616-a5d310fbb07d?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&w=1400&q=80",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground news-grid-bg">
      <header className="border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-[88rem] flex-col gap-5 px-5 py-6 sm:px-7 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border pb-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-brand">BYTE BULLETIN</p>
              <h1 className="mt-1 text-5xl leading-none sm:text-6xl">News That Matters</h1>
            </div>
            <p className="text-base text-muted">{today}</p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-base font-semibold uppercase tracking-wide text-[#33475b]">
            {categories.map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`} className="transition hover:text-brand">
                {category.name}
              </Link>
            ))}
            <Link href="/fact-check" className="transition hover:text-brand">
              Fact Check
            </Link>
            <Link href="/topics" className="transition hover:text-brand">
              Topics
            </Link>
            <Link href="/search" className="transition hover:text-brand">
              Search
            </Link>
            <Link href="/videos" className="transition hover:text-brand">
              Videos
            </Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-border bg-brand px-5 py-3 text-brand-soft sm:px-7 lg:px-10">
        <div className="mx-auto flex max-w-[88rem] items-center gap-3 overflow-hidden text-sm font-semibold">
          <span className="rounded bg-brand-soft px-2 py-1 text-brand">Breaking</span>
          <div className="relative w-full overflow-hidden">
            <div className="ticker-track flex w-[200%] gap-8 whitespace-nowrap">
              {[...breaking, ...breaking].map((item, index) => (
                <span key={`${item}-${index}`}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-[88rem] gap-10 px-5 py-10 sm:px-7 lg:grid-cols-[2fr_1fr] lg:px-10">
        <section className="reveal-up space-y-10">
          <article className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Lead Story</p>
            <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">{featured.title}</h2>
            <p className="mt-4 max-w-3xl text-lg text-[#425668]">{featured.summary}</p>
            <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-xl border border-border">
              <Image
                src={resolveStoryImage(featured)}
                alt={featured.title}
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover"
                priority
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted">
              <span>{featured.author}</span>
              <span>|</span>
              <span>{featured.location}</span>
              <span>|</span>
              <span>{featured.publishedAt}</span>
            </div>
            <Link
              href={`/news/${featured.slug}`}
              className="mt-6 inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-soft transition hover:opacity-90"
            >
              Read Full Story
            </Link>
          </article>

          <section>
            <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-3xl">Latest Updates</h3>
              <Link href="/category/national" className="text-sm font-semibold text-brand hover:underline">
                View all
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {liveUpdates.length > 0
                ? liveUpdates.map((update, index) => (
                    <article key={update.url} className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-widest text-brand">Daily Wire</p>
                      <div className="relative mt-3 aspect-[16/10] overflow-hidden rounded-lg border border-border">
                        <Image
                          src={liveUpdateImageFallbacks[index % liveUpdateImageFallbacks.length]}
                          alt={update.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 48vw"
                          className="object-cover"
                        />
                      </div>
                      <h4 className="title-clamp mt-2 text-2xl leading-tight">{update.title}</h4>
                      <p className="excerpt-clamp mt-3 text-base text-muted">{update.description || "Read the full update from the source."}</p>
                      <div className="mt-4 text-sm text-muted">{update.publishedAt || "Updated recently"}</div>
                      <a
                        href={update.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block text-base font-semibold text-brand hover:underline"
                      >
                        Read full update
                      </a>
                    </article>
                  ))
                : fallbackLatestStories.map((story) => (
                    <article key={story.slug} className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-widest text-brand">{story.category}</p>
                      <div className="relative mt-3 aspect-[16/10] overflow-hidden rounded-lg border border-border">
                        <Image
                          src={resolveStoryImage(story)}
                          alt={story.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 48vw"
                          className="object-cover"
                        />
                      </div>
                      <h4 className="title-clamp mt-2 text-2xl leading-tight">{story.title}</h4>
                      <p className="excerpt-clamp mt-3 text-base text-muted">{story.summary}</p>
                      <div className="mt-4 text-sm text-muted">{story.readTime}</div>
                      <Link href={`/news/${story.slug}`} className="mt-4 inline-block text-base font-semibold text-brand hover:underline">
                        Continue reading
                      </Link>
                    </article>
                  ))}
            </div>
          </section>
        </section>

        <aside className="reveal-up space-y-8" style={{ animationDelay: "120ms" }}>
          <section className="rounded-xl border border-border bg-surface p-6">
            <h3 className="text-2xl">Trending</h3>
            <div className="mt-4 space-y-4">
              {trendingStories.map((story, index) => (
                <article key={story.slug} className="border-b border-border pb-3 last:border-none last:pb-0">
                  <p className="text-sm font-semibold text-brand">0{index + 1}</p>
                  <h4 className="mt-1 text-xl leading-snug">{story.title}</h4>
                  <Link href={`/news/${story.slug}`} className="mt-2 inline-block text-sm font-semibold uppercase tracking-wide text-muted hover:text-brand">
                    Read more
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-2xl">City Utility</h3>
              <span className="text-sm text-muted">{utilityWidgets.city}</span>
            </div>
            <div className="mt-5 space-y-4 text-base">
              <div className="rounded-md border border-border p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand">Weather</p>
                <p className="mt-1 text-lg">
                  {utilityWidgets.weather.temperatureC}C | {utilityWidgets.weather.condition}
                </p>
                <p className="text-sm text-muted">Wind {utilityWidgets.weather.windKph} km/h</p>
              </div>
              <div className="rounded-md border border-border p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand">Air Quality</p>
                <p className="mt-1 text-lg">AQI {utilityWidgets.airQuality.aqi ?? "--"}</p>
                <p className="text-sm text-muted">
                  PM2.5 {utilityWidgets.airQuality.pm25 ?? "--"} | PM10 {utilityWidgets.airQuality.pm10 ?? "--"}
                </p>
              </div>
              <div className="rounded-md border border-border p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand">INR FX</p>
                <p className="mt-1 text-lg">
                  USD {utilityWidgets.forex.usd ?? "--"} | EUR {utilityWidgets.forex.eur ?? "--"}
                </p>
                <p className="text-sm text-muted">Updated {utilityWidgets.updatedAt}</p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-[#1e3242] p-6 text-[#ecf5ff]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8bc2f5]">Newsletter</p>
            <h3 className="mt-2 text-3xl">Get the Morning Brief</h3>
            <p className="mt-3 text-base text-[#d4e7f8]">
              Daily digest on policy, business and technology in under 5 minutes.
            </p>
            <form className="mt-5 space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md border border-[#4f667b] bg-[#243d50] px-4 py-3 text-base outline-none placeholder:text-[#a2c3df] focus:border-[#8bc2f5]"
              />
              <button type="submit" className="w-full rounded-md bg-[#8bc2f5] px-4 py-3 text-base font-semibold text-[#163148]">
                Subscribe Free
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6">
            <h3 className="text-2xl">Editor&apos;s Note</h3>
            <p className="mt-3 text-base leading-relaxed text-muted">
              Byte Bulletin is designed for readers who want depth without noise. Every piece is built for clarity, context and responsible reporting.
            </p>
          </section>
        </aside>

        <section className="reveal-up space-y-10 lg:col-span-2" style={{ animationDelay: "220ms" }}>
          <section>
            <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-3xl">Fact Check Lane</h3>
              <Link href="/fact-check" className="text-sm font-semibold text-brand hover:underline">
                View all checks
              </Link>
            </div>
            <div className="grid auto-rows-fr gap-6 md:grid-cols-3">
              {factChecks.map((check) => (
                <article key={check.slug} className="flex h-full flex-col rounded-xl border border-border bg-surface p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#1e3242] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#ecf5ff]">
                      {check.verdict}
                    </span>
                    <span className="text-sm text-muted">{check.publishedAt}</span>
                  </div>
                  <h4 className="mt-3 text-2xl leading-tight">{check.title}</h4>
                  <p className="mt-3 text-base text-muted">{check.summary}</p>
                  <p className="mt-3 text-sm text-muted">Claim: {check.claim}</p>
                  <Link href="/fact-check" className="mt-auto inline-block pt-4 text-base font-semibold text-brand hover:underline">
                    See evidence
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-3xl">Topic Timelines</h3>
              <Link href="/topics" className="text-sm font-semibold text-brand hover:underline">
                Explore topics
              </Link>
            </div>
            <div className="grid auto-rows-fr gap-6 md:grid-cols-3">
              {topicCards.map((topic) => (
                <article key={topic.slug} className="flex h-full flex-col rounded-xl border border-border bg-surface p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand">Ongoing Story</p>
                  <h4 className="mt-2 text-2xl leading-tight">{topic.name}</h4>
                  <p className="mt-3 text-base text-muted">{topic.summary}</p>
                  <Link href={`/topic/${topic.slug}`} className="mt-auto inline-block pt-4 text-base font-semibold text-brand hover:underline">
                    Open timeline
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-3xl">Video Bulletin</h3>
              <Link href="/videos" className="text-sm font-semibold text-brand hover:underline">
                Watch all
              </Link>
            </div>
            <div className="grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
              <article className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
                <div className="aspect-video bg-[#1e3242]">
                  {featuredVideoEmbed ? (
                    <iframe
                      src={featuredVideoEmbed}
                      title={featuredVideo.title}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-semibold text-[#ecf5ff]">
                      Video unavailable
                    </div>
                  )}
                </div>
                <div className="p-6 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand">Featured Video</p>
                  <h4 className="mt-3 text-3xl leading-tight">{featuredVideo.title}</h4>
                  <p className="mt-3 text-base text-muted">{featuredVideo.summary}</p>
                  <div className="mt-4 text-sm text-muted">
                    {(featuredVideo.source || "Byte Bulletin") + " | " + featuredVideo.publishedAt}
                  </div>
                </div>
              </article>

              <div className="space-y-6">
                {latestVideos.slice(0, 3).map((video) => {
                  const thumbnail = getYoutubeThumbnailUrl(video.youtubeUrl);
                  return (
                    <a
                      key={video.slug}
                      href={video.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-xl border border-border bg-surface p-5 transition hover:shadow-sm"
                    >
                      <div className="relative aspect-video overflow-hidden rounded-md bg-[#dae5ef]">
                        {thumbnail ? (
                          <Image
                            src={thumbnail}
                            alt={video.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 320px"
                            className="object-cover transition group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs font-semibold text-[#3f5567]">No preview</div>
                        )}
                        <span className="absolute bottom-2 left-2 rounded bg-black/75 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                          Play
                        </span>
                      </div>
                      <h4 className="mt-3 text-xl leading-snug">{video.title}</h4>
                      <p className="mt-2 text-sm text-muted">{(video.source || "Byte Bulletin") + " | " + video.publishedAt}</p>
                    </a>
                  );
                })}
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-4 border-b border-border pb-2 text-3xl">Section Highlights</h3>
            <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sectionHighlights.map(({ category, story }) => {
                return (
                  <article key={`${category.slug}-${story.slug}`} className="flex h-full flex-col rounded-xl border border-border bg-surface p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: category.accent }}>
                      {category.name}
                    </p>
                    <div className="relative mt-3 aspect-[16/10] overflow-hidden rounded-lg border border-border">
                      <Image
                        src={resolveStoryImage(story)}
                        alt={story.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <h4 className="mt-2 text-2xl leading-tight">{story.title}</h4>
                    <p className="mt-3 text-base text-muted">{story.summary}</p>
                    <Link href={`/category/${category.slug}`} className="mt-auto inline-block pt-4 text-base font-semibold text-brand hover:underline">
                      Explore {category.name}
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
