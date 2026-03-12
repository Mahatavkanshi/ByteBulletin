import Link from "next/link";
import { getHomepageStories, getHomepageVideos, getStoriesByCategory } from "@/lib/content";
import { getYoutubeEmbedUrl, getYoutubeThumbnailUrl } from "@/lib/video-utils";

export default async function Home() {
  const [{ featured, latest, trending, categories, liveUpdates, breaking }, { featuredVideo, latestVideos }] =
    await Promise.all([getHomepageStories(), getHomepageVideos()]);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const sectionHighlights = (
    await Promise.all(
      categories.slice(0, 6).map(async (category) => {
        const firstStory = (await getStoriesByCategory(category.slug))[0];
        return firstStory ? { category, story: firstStory } : null;
      }),
    )
  ).filter((item) => item !== null);
  const featuredVideoEmbed = getYoutubeEmbedUrl(featuredVideo.youtubeUrl);

  return (
    <div className="min-h-screen bg-background text-foreground news-grid-bg">
      <header className="border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border pb-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-brand">BYTE BULLETIN</p>
              <h1 className="mt-1 text-4xl leading-none sm:text-5xl">News That Matters</h1>
            </div>
            <p className="text-sm text-muted">{today}</p>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold uppercase tracking-wide text-[#33475b]">
            {categories.map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`} className="transition hover:text-brand">
                {category.name}
              </Link>
            ))}
            <Link href="/search" className="transition hover:text-brand">
              Search
            </Link>
            <Link href="/videos" className="transition hover:text-brand">
              Videos
            </Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-border bg-brand px-4 py-2 text-brand-soft sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center gap-3 overflow-hidden text-sm font-semibold">
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

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[2fr_1fr] lg:px-8">
        <section className="reveal-up space-y-8">
          <article className="rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Lead Story</p>
            <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">{featured.title}</h2>
            <p className="mt-4 max-w-3xl text-lg text-[#425668]">{featured.summary}</p>
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
              <h3 className="text-2xl">Latest Updates</h3>
              <Link href="/category/national" className="text-sm font-semibold text-brand hover:underline">
                View all
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {liveUpdates.length > 0
                ? liveUpdates.map((update) => (
                    <article key={update.url} className="rounded-lg border border-border bg-surface p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-widest text-brand">Daily Wire</p>
                      <h4 className="mt-2 text-xl leading-tight">{update.title}</h4>
                      <p className="mt-2 text-sm text-muted">{update.description || "Read the full update from the source."}</p>
                      <div className="mt-3 text-xs text-muted">{update.publishedAt || "Updated recently"}</div>
                      <a
                        href={update.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-sm font-semibold text-brand hover:underline"
                      >
                        Read full update
                      </a>
                    </article>
                  ))
                : latest.map((story) => (
                    <article key={story.slug} className="rounded-lg border border-border bg-surface p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-widest text-brand">{story.category}</p>
                      <h4 className="mt-2 text-xl leading-tight">{story.title}</h4>
                      <p className="mt-2 text-sm text-muted">{story.summary}</p>
                      <div className="mt-3 text-xs text-muted">{story.readTime}</div>
                      <Link href={`/news/${story.slug}`} className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">
                        Continue reading
                      </Link>
                    </article>
                  ))}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-2xl">Video Bulletin</h3>
              <Link href="/videos" className="text-sm font-semibold text-brand hover:underline">
                Watch all
              </Link>
            </div>
            <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
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
                <div className="p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand">Featured Video</p>
                  <h4 className="mt-2 text-2xl leading-tight">{featuredVideo.title}</h4>
                  <p className="mt-2 text-sm text-muted">{featuredVideo.summary}</p>
                  <div className="mt-3 text-xs text-muted">{featuredVideo.publishedAt}</div>
                </div>
              </article>

              <div className="space-y-4">
                {latestVideos.slice(0, 3).map((video) => {
                  const thumbnail = getYoutubeThumbnailUrl(video.youtubeUrl);
                  return (
                    <a
                      key={video.slug}
                      href={video.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-lg border border-border bg-surface p-3 transition hover:shadow-sm"
                    >
                      <div className="relative aspect-video overflow-hidden rounded-md bg-[#dae5ef]">
                        {thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumbnail} alt={video.title} className="h-full w-full object-cover transition group-hover:scale-[1.02]" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs font-semibold text-[#3f5567]">No preview</div>
                        )}
                        <span className="absolute bottom-2 left-2 rounded bg-black/75 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                          Play
                        </span>
                      </div>
                      <h4 className="mt-2 text-base leading-snug">{video.title}</h4>
                      <p className="mt-1 text-xs text-muted">{video.publishedAt}</p>
                    </a>
                  );
                })}
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-4 border-b border-border pb-2 text-2xl">Section Highlights</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sectionHighlights.map(({ category, story }) => {
                return (
                  <article key={category.slug} className="rounded-lg border border-border bg-surface p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: category.accent }}>
                      {category.name}
                    </p>
                    <h4 className="mt-2 text-lg leading-tight">{story.title}</h4>
                    <p className="mt-2 text-sm text-muted">{story.summary}</p>
                    <Link href={`/category/${category.slug}`} className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">
                      Explore {category.name}
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        </section>

        <aside className="reveal-up space-y-6" style={{ animationDelay: "120ms" }}>
          <section className="rounded-xl border border-border bg-surface p-5">
            <h3 className="text-xl">Trending</h3>
            <div className="mt-4 space-y-4">
              {trending.map((story, index) => (
                <article key={story.slug} className="border-b border-border pb-3 last:border-none last:pb-0">
                  <p className="text-xs font-semibold text-brand">0{index + 1}</p>
                  <h4 className="mt-1 text-base leading-snug">{story.title}</h4>
                  <Link href={`/news/${story.slug}`} className="mt-1 inline-block text-xs font-semibold uppercase tracking-wide text-muted hover:text-brand">
                    Read more
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-[#1e3242] p-5 text-[#ecf5ff]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8bc2f5]">Newsletter</p>
            <h3 className="mt-2 text-2xl">Get the Morning Brief</h3>
            <p className="mt-2 text-sm text-[#d4e7f8]">
              Daily digest on policy, business and technology in under 5 minutes.
            </p>
            <form className="mt-4 space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md border border-[#4f667b] bg-[#243d50] px-3 py-2 text-sm outline-none placeholder:text-[#a2c3df] focus:border-[#8bc2f5]"
              />
              <button type="submit" className="w-full rounded-md bg-[#8bc2f5] px-3 py-2 text-sm font-semibold text-[#163148]">
                Subscribe Free
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-border bg-surface p-5">
            <h3 className="text-xl">Editor&apos;s Note</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Byte Bulletin is designed for readers who want depth without noise. Every piece is built for clarity, context and responsible reporting.
            </p>
          </section>
        </aside>
      </main>
    </div>
  );
}
