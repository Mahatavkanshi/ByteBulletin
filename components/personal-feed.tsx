"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PersonalFeedStory = {
  title: string;
  slug: string;
  summary: string;
  category: string;
  publishedAt: string;
  topic?: {
    slug: string;
    name: string;
  };
};

type PersonalFeedProps = {
  stories: PersonalFeedStory[];
  categories: Array<{ slug: string; name: string }>;
  topics: Array<{ slug: string; name: string }>;
};

const categoryStorageKey = "byte-bulletin-followed-categories";
const topicStorageKey = "byte-bulletin-followed-topics";

function readStoredSelection(key: string) {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]") as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as string[];
  }
}

export function PersonalFeed({ stories, categories, topics }: PersonalFeedProps) {
  const [followedCategories, setFollowedCategories] = useState<string[]>([]);
  const [followedTopics, setFollowedTopics] = useState<string[]>([]);

  useEffect(() => {
    const savedCategories = readStoredSelection(categoryStorageKey);
    const savedTopics = readStoredSelection(topicStorageKey);

    queueMicrotask(() => {
      setFollowedCategories(savedCategories);
      setFollowedTopics(savedTopics);
    });
  }, []);

  function persistSelections(nextCategories: string[], nextTopics: string[]) {
    localStorage.setItem(categoryStorageKey, JSON.stringify(nextCategories));
    localStorage.setItem(topicStorageKey, JSON.stringify(nextTopics));
  }

  function toggleCategory(slug: string) {
    const nextCategories = followedCategories.includes(slug)
      ? followedCategories.filter((value) => value !== slug)
      : [...followedCategories, slug];

    setFollowedCategories(nextCategories);
    persistSelections(nextCategories, followedTopics);
  }

  function toggleTopic(slug: string) {
    const nextTopics = followedTopics.includes(slug)
      ? followedTopics.filter((value) => value !== slug)
      : [...followedTopics, slug];

    setFollowedTopics(nextTopics);
    persistSelections(followedCategories, nextTopics);
  }

  const filteredStories = useMemo(() => {
    if (followedCategories.length === 0 && followedTopics.length === 0) {
      return stories.slice(0, 4);
    }

    return stories
      .filter((story) => {
        const categoryMatch = followedCategories.includes(story.category);
        const topicMatch = Boolean(story.topic?.slug && followedTopics.includes(story.topic.slug));
        return categoryMatch || topicMatch;
      })
      .slice(0, 6);
  }, [stories, followedCategories, followedTopics]);

  return (
    <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center border-b border-border pb-3">
        <h3 className="text-3xl">For You</h3>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Follow categories</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.slice(0, 6).map((category) => {
              const active = followedCategories.includes(category.slug);

              return (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => toggleCategory(category.slug)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold uppercase tracking-wide ${
                    active ? "bg-brand text-brand-soft" : "border border-border text-muted"
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Follow topics</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {topics.slice(0, 6).map((topic) => {
              const active = followedTopics.includes(topic.slug);

              return (
                <button
                  key={topic.slug}
                  type="button"
                  onClick={() => toggleTopic(topic.slug)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold uppercase tracking-wide ${
                    active ? "bg-[#1e3242] text-[#ecf5ff]" : "border border-border text-muted"
                  }`}
                >
                  {topic.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid auto-rows-fr gap-4">
          {filteredStories.length === 0 ? (
            <p className="text-base text-muted">Choose at least one category or topic to personalize your feed.</p>
          ) : (
            filteredStories.map((story) => (
              <article key={story.slug} className="flex h-full flex-col rounded-lg border border-border bg-background p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand">{story.category}</p>
                <h4 className="mt-2 text-2xl leading-snug">{story.title}</h4>
                <p className="mt-2 text-base text-muted">{story.summary}</p>
                <div className="mt-3 text-sm text-muted">{story.publishedAt}</div>
                <Link href={`/news/${story.slug}`} className="mt-auto inline-block pt-4 text-base font-semibold text-brand hover:underline">
                  Open story
                </Link>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
