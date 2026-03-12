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
    coverImage,
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
    coverImage,
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
