"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { resolveStoryImage } from "@/lib/news-data";

type BriefStory = {
  title: string;
  slug: string;
  summary: string;
  category: string;
  publishedAt: string;
  readTime: string;
  coverImageUrl?: string;
};

type DailyBriefBoardProps = {
  morningStories: BriefStory[];
  eveningStories: BriefStory[];
  explainerStory: BriefStory | null;
};

const savedStoriesStorageKey = "byte-bulletin-saved-stories";

function dedupeStories(stories: BriefStory[]) {
  const seen = new Set<string>();

  return stories.filter((story) => {
    if (seen.has(story.slug)) {
      return false;
    }

    seen.add(story.slug);
    return true;
  });
}

function readSavedStories() {
  if (typeof window === "undefined") {
    return [] as BriefStory[];
  }

  try {
    const stored = JSON.parse(localStorage.getItem(savedStoriesStorageKey) || "[]") as BriefStory[];
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [] as BriefStory[];
  }
}

export function DailyBriefBoard({ morningStories, eveningStories, explainerStory }: DailyBriefBoardProps) {
  const [savedStories, setSavedStories] = useState<BriefStory[]>(() => readSavedStories());

  const candidateStories = useMemo(
    () => dedupeStories([...morningStories, ...eveningStories, ...(explainerStory ? [explainerStory] : [])]),
    [morningStories, eveningStories, explainerStory],
  );

  const quickReadStories = useMemo(() => {
    const excluded = new Set<string>([
      ...morningStories.map((story) => story.slug),
      ...eveningStories.map((story) => story.slug),
      ...(explainerStory ? [explainerStory.slug] : []),
    ]);

    const extras = candidateStories.filter((story) => !excluded.has(story.slug)).slice(0, 4);
    return extras.length > 0 ? extras : candidateStories.slice(0, 4);
  }, [candidateStories, eveningStories, explainerStory, morningStories]);

  function saveToStorage(nextStories: BriefStory[]) {
    setSavedStories(nextStories);
    localStorage.setItem(savedStoriesStorageKey, JSON.stringify(nextStories));
  }

  function toggleSave(story: BriefStory) {
    const alreadySaved = savedStories.some((saved) => saved.slug === story.slug);

    if (alreadySaved) {
      saveToStorage(savedStories.filter((saved) => saved.slug !== story.slug));
      return;
    }

    saveToStorage([story, ...savedStories].slice(0, 20));
  }

  function isSaved(story: BriefStory) {
    return savedStories.some((saved) => saved.slug === story.slug);
  }

  function renderBriefList(stories: BriefStory[], heading: string) {
    return (
      <section className="rounded-xl border border-border bg-background p-5">
        <h4 className="text-xl">{heading}</h4>
        <div className="mt-4 space-y-4">
          {stories.length === 0 ? (
            <p className="text-sm text-muted">More stories will appear in this brief shortly.</p>
          ) : (
            stories.map((story) => (
              <article key={`${heading}-${story.slug}`} className="rounded-lg border border-border bg-surface p-4">
                <div className="relative aspect-[16/8] overflow-hidden rounded-md border border-border">
                  <Image src={resolveStoryImage(story)} alt={story.title} fill sizes="(max-width: 1280px) 100vw, 650px" className="object-cover" />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand">{story.category}</p>
                  <button
                    type="button"
                    onClick={() => toggleSave(story)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                      isSaved(story) ? "bg-[#1e3242] text-[#ecf5ff]" : "border border-border text-muted"
                    }`}
                  >
                    {isSaved(story) ? "Saved" : "Save"}
                  </button>
                </div>
                <h5 className="title-clamp mt-2 text-2xl leading-tight">{story.title}</h5>
                <p className="excerpt-clamp mt-2 text-sm text-muted">{story.summary}</p>
                <p className="mt-2 text-xs text-muted">
                  {story.publishedAt} | {story.readTime}
                </p>
                <Link href={`/news/${story.slug}`} className="mt-2 inline-block text-sm font-semibold text-brand hover:underline">
                  Open story
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <h3 className="text-3xl">Daily Briefs</h3>
        <span className="text-sm text-muted">Morning + Evening roundup</span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="grid gap-6 md:grid-cols-2">
          {renderBriefList(morningStories, "Morning Brief")}
          {renderBriefList(eveningStories, "Evening Wrap")}
        </div>

        <aside className="flex h-full flex-col gap-6">
          <section className="rounded-xl border border-border bg-background p-5">
            <h4 className="text-xl">Explainer of the Day</h4>
            {explainerStory ? (
              <article className="mt-4 rounded-lg border border-border bg-surface p-4">
                <div className="relative aspect-[16/9] overflow-hidden rounded-md border border-border">
                  <Image
                    src={resolveStoryImage(explainerStory)}
                    alt={explainerStory.title}
                    fill
                    sizes="(max-width: 1280px) 100vw, 360px"
                    className="object-cover"
                  />
                </div>
                <h5 className="mt-3 text-2xl leading-tight">{explainerStory.title}</h5>
                <p className="mt-2 text-sm text-muted">{explainerStory.summary}</p>
                <Link href={`/news/${explainerStory.slug}`} className="mt-2 inline-block text-sm font-semibold text-brand hover:underline">
                  Read explainer
                </Link>
              </article>
            ) : (
              <p className="mt-4 text-sm text-muted">Explainer will be published soon.</p>
            )}
          </section>

          <section className="rounded-xl border border-border bg-background p-5">
            <h4 className="text-xl">Saved Stories</h4>
            <div className="mt-4 space-y-3">
              {savedStories.length === 0 ? (
                <p className="text-sm text-muted">Use save buttons in Daily Brief cards to collect stories here.</p>
              ) : (
                savedStories.slice(0, 6).map((story) => (
                  <article key={`saved-${story.slug}`} className="rounded-md border border-border bg-surface p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand">{story.category}</p>
                    <h5 className="mt-1 text-base leading-snug">{story.title}</h5>
                    <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted">
                      <span>{story.publishedAt}</span>
                      <button type="button" onClick={() => toggleSave(story)} className="font-semibold text-brand hover:underline">
                        Remove
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="flex-1 rounded-xl border border-border bg-background p-5">
            <h4 className="text-xl">Quick Reads</h4>
            <p className="mt-2 text-sm text-muted">Fast links from today&apos;s brief desk.</p>
            <div className="mt-4 space-y-3">
              {quickReadStories.map((story, index) => (
                <article key={`quick-${story.slug}`} className="rounded-md border border-border bg-surface p-3">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-brand">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="text-sm font-semibold leading-snug">{story.title}</p>
                      <p className="mt-1 text-xs text-muted">
                        {story.category} | {story.publishedAt}
                      </p>
                    </div>
                  </div>
                  <Link href={`/news/${story.slug}`} className="mt-2 inline-block text-xs font-semibold text-brand hover:underline">
                    Open
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>

      {candidateStories.length === 0 ? <p className="mt-5 text-sm text-muted">Daily briefs are being prepared.</p> : null}
    </section>
  );
}
