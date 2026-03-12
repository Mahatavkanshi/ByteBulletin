import type { MetadataRoute } from "next";
import { getAllSlugs, getCategorySlugs, getTopicSlugs } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const articleSlugs = await getAllSlugs();
  const categorySlugs = await getCategorySlugs();
  const topicSlugs = await getTopicSlugs();

  const articleRoutes = articleSlugs.map((slug) => ({
    url: `${baseUrl}/news/${slug}`,
    lastModified: new Date(),
  }));

  const categoryRoutes = categorySlugs.map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: new Date(),
  }));

  const topicRoutes = topicSlugs.map((slug) => ({
    url: `${baseUrl}/topic/${slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/fact-check`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/topics`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: new Date(),
    },
    ...articleRoutes,
    ...categoryRoutes,
    ...topicRoutes,
  ];
}
