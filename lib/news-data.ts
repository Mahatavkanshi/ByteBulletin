export type Category = {
  name: string;
  slug: string;
  accent: string;
};

export type NewsArticle = {
  title: string;
  slug: string;
  summary: string;
  category: string;
  author: string;
  location: string;
  publishedAt: string;
  readTime: string;
  featured?: boolean;
  trending?: boolean;
  content: string[];
};

export const categories: Category[] = [
  { name: "National", slug: "national", accent: "#8b1f1f" },
  { name: "World", slug: "world", accent: "#123f6b" },
  { name: "Business", slug: "business", accent: "#20503e" },
  { name: "Technology", slug: "technology", accent: "#4d2a7a" },
  { name: "Sport", slug: "sport", accent: "#8a4a11" },
  { name: "Opinion", slug: "opinion", accent: "#6a3e24" },
];

export const newsArticles: NewsArticle[] = [
  {
    title: "Metro corridors expand as city unveils a new affordable pass",
    slug: "metro-corridors-expand-affordable-pass",
    summary:
      "The transport authority announces a two-tier monthly pass that lowers costs for regular commuters and students.",
    category: "national",
    author: "Ananya Menon",
    location: "Chennai",
    publishedAt: "Mar 11, 2026",
    readTime: "6 min read",
    featured: true,
    trending: true,
    content: [
      "The state transport authority on Wednesday introduced a revised fare framework for metro corridors, aiming to reduce costs for frequent riders and students. The new monthly pass allows unlimited travel during non-peak hours and discounted rides in peak windows.",
      "Officials say the revision follows a six-month commuter survey that highlighted rising transport costs and congestion around key office districts. The revised policy is expected to come into effect from the next billing cycle.",
      "Urban mobility experts welcomed the change but emphasised that last-mile connectivity, especially feeder bus links and safer pedestrian access, remains the deciding factor in long-term adoption.",
    ],
  },
  {
    title: "India and ASEAN discuss resilient supply chains amid global uncertainty",
    slug: "india-asean-resilient-supply-chains",
    summary:
      "Trade delegates focus on semiconductors, pharmaceuticals and logistics corridors at the annual dialogue summit.",
    category: "world",
    author: "Ritika Suri",
    location: "New Delhi",
    publishedAt: "Mar 11, 2026",
    readTime: "5 min read",
    trending: true,
    content: [
      "At the annual India-ASEAN economic dialogue, member states reviewed progress on cross-border logistics, clean energy partnerships and digital customs procedures. Delegations highlighted delays in shipping routes and volatile component pricing.",
      "India proposed a coordinated framework for strategic inventory planning in semiconductors and essential pharmaceuticals. Officials from multiple capitals said the framework could reduce disruptions caused by geopolitical shocks.",
      "Negotiators are expected to continue talks through the quarter, with a progress note scheduled ahead of the ministerial review in June.",
    ],
  },
  {
    title: "Small manufacturers adopt AI forecasting tools to reduce inventory waste",
    slug: "small-manufacturers-ai-forecasting-tools",
    summary:
      "Pilot programs in Coimbatore and Pune show improved demand planning and lower warehousing costs.",
    category: "business",
    author: "Nikhil Jain",
    location: "Mumbai",
    publishedAt: "Mar 10, 2026",
    readTime: "4 min read",
    trending: true,
    content: [
      "Small and medium manufacturing units are increasingly using subscription-based forecasting tools to estimate seasonal demand. Industry bodies report that adoption has risen sharply in textiles, auto components and consumer goods.",
      "In pilot clusters, participating firms reported lower overstock levels and better production schedules. Vendors offering these tools say simplified dashboards and multilingual interfaces have improved usability among first-time users.",
      "Economists caution that forecasting gains must be matched by reliable logistics and credit access to sustain margin improvements across the sector.",
    ],
  },
  {
    title: "New open-source language model sparks race for lower-cost AI apps",
    slug: "open-source-language-model-lower-cost-ai-apps",
    summary:
      "Developers report faster experimentation cycles as community-built models challenge closed ecosystems.",
    category: "technology",
    author: "Farah Ali",
    location: "Bengaluru",
    publishedAt: "Mar 10, 2026",
    readTime: "7 min read",
    content: [
      "A newly released open-source language model is drawing significant interest from startups and university labs. Developers cite lower deployment costs and flexible licensing as key advantages for niche products.",
      "The model's maintainers have published benchmark data showing competitive performance in summarisation and question-answering tasks. Independent researchers are now validating these claims across regional language datasets.",
      "Industry analysts expect open model ecosystems to pressure enterprise software pricing, especially in sectors where custom workflows are more important than raw benchmark scores.",
    ],
  },
  {
    title: "Women’s league final sees record attendance as grassroots programs mature",
    slug: "womens-league-final-record-attendance",
    summary:
      "Clubs credit school-level partnerships and local coaching camps for the sharp rise in participation.",
    category: "sport",
    author: "Dev Kapoor",
    location: "Kolkata",
    publishedAt: "Mar 10, 2026",
    readTime: "5 min read",
    content: [
      "The national women's league final drew a record crowd this season, reflecting a sustained rise in grassroots participation and improved broadcast visibility. Ticket sales in host cities have grown steadily over the past two years.",
      "League officials said early investment in school partnerships and district coaching camps has expanded talent pipelines. Clubs are now seeking longer player contracts and better support infrastructure.",
      "Sports policy researchers say consistency in domestic scheduling will be crucial if recent gains are to translate into international competitiveness.",
    ],
  },
  {
    title: "Why cities need climate budgets, not just climate slogans",
    slug: "why-cities-need-climate-budgets",
    summary:
      "Urban resilience requires transparent spending plans tied to flood maps, heat data and public health indicators.",
    category: "opinion",
    author: "Editorial Board",
    location: "Byte Bulletin Desk",
    publishedAt: "Mar 9, 2026",
    readTime: "8 min read",
    content: [
      "City administrations increasingly frame climate action as a communication priority, but policy execution depends on annual budgets with measurable outcomes. Without budget-linked goals, adaptation remains fragmented.",
      "Heat shelters, stormwater upgrades and cooling corridors require predictable financing cycles. A transparent municipal climate ledger can help citizens track progress and hold elected representatives accountable.",
      "The next decade will test whether cities can integrate climate adaptation into everyday planning rather than treating it as a parallel agenda.",
    ],
  },
];

export function getFeaturedStory() {
  return newsArticles.find((article) => article.featured) ?? newsArticles[0];
}

export function getLatestStories(limit = 5) {
  return newsArticles.slice(0, limit);
}

export function getTrendingStories(limit = 4) {
  return newsArticles.filter((article) => article.trending).slice(0, limit);
}

export function getCategoryStories(categorySlug: string) {
  return newsArticles.filter((article) => article.category === categorySlug);
}

export function getStoryBySlug(slug: string) {
  return newsArticles.find((article) => article.slug === slug);
}

export function getRelatedStories(slug: string, category: string) {
  return newsArticles
    .filter((article) => article.slug !== slug && article.category === category)
    .slice(0, 3);
}
