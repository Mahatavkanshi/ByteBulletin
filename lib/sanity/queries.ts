import { groq } from "next-sanity";

export const categoriesQuery = groq`
  *[_type == "category"] | order(name asc) {
    name,
    "slug": slug.current,
    accent
  }
`;

export const allArticlesQuery = groq`
  *[_type == "article"] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    summary,
    "category": category->slug.current,
    "author": author->name,
    location,
    publishedAt,
    readTime,
    featured,
    trending,
    "topic": topic->{
      name,
      "slug": slug.current
    },
    whyItMatters,
    whatChanged,
    whatNext,
    sixtySecondBrief,
    sourceLinks[]{label, url},
    lastVerified,
    "coverImageUrl": coverImage.asset->url,
    body
  }
`;

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    summary,
    "category": category->slug.current,
    "author": author->name,
    location,
    publishedAt,
    readTime,
    featured,
    trending,
    "topic": topic->{
      name,
      "slug": slug.current
    },
    whyItMatters,
    whatChanged,
    whatNext,
    sixtySecondBrief,
    sourceLinks[]{label, url},
    lastVerified,
    "coverImageUrl": coverImage.asset->url,
    body
  }
`;

export const allVideosQuery = groq`
  *[_type == "videoStory"] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    summary,
    youtubeUrl,
    source,
    "category": category->slug.current,
    publishedAt,
    featured
  }
`;

export const allFactChecksQuery = groq`
  *[_type == "factCheck"] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    claim,
    verdict,
    summary,
    explanation,
    region,
    publishedAt,
    evidence[]{label, url}
  }
`;

export const allTopicsQuery = groq`
  *[_type == "topic"] | order(name asc) {
    name,
    "slug": slug.current,
    summary
  }
`;

export const topicBySlugQuery = groq`
  *[_type == "topic" && slug.current == $slug][0] {
    name,
    "slug": slug.current,
    summary
  }
`;

export const timelineEventsByTopicQuery = groq`
  *[_type == "timelineEvent" && topic->slug.current == $slug] | order(eventAt desc) {
    title,
    "slug": slug.current,
    "topicSlug": topic->slug.current,
    update,
    eventAt,
    sourceLinks[]{label, url}
  }
`;
