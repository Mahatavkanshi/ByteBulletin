import type { MetadataRoute } from "next";
import { getAllSlugs, getCategorySlugs } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "http://localhost:3000";
  const articleSlugs = await getAllSlugs();
  const categorySlugs = await getCategorySlugs();

  const articleRoutes = articleSlugs.map((slug) => ({
    url: `${baseUrl}/news/${slug}`,
    lastModified: new Date(),
  }));

  const categoryRoutes = categorySlugs.map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
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
    ...articleRoutes,
    ...categoryRoutes,
  ];
}
