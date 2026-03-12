export type SourceLink = {
  label: string;
  url: string;
};

export type TopicReference = {
  name: string;
  slug: string;
};

export type Category = {
  name: string;
  slug: string;
  accent: string;
};

export type NewsArticle = {
  title: string;
  slug: string;
  summary: string;
  coverImageUrl?: string;
  category: string;
  author: string;
  location: string;
  publishedAt: string;
  readTime: string;
  featured?: boolean;
  trending?: boolean;
  topic?: TopicReference;
  whyItMatters?: string[];
  whatChanged?: string[];
  whatNext?: string[];
  sixtySecondBrief?: string[];
  sourceLinks?: SourceLink[];
  lastVerified?: string;
  content: string[];
};

export type VideoStory = {
  title: string;
  slug: string;
  summary: string;
  youtubeUrl: string;
  source?: string;
  category: string;
  publishedAt: string;
  featured?: boolean;
};

export type FactCheckItem = {
  title: string;
  slug: string;
  claim: string;
  verdict: "True" | "False" | "Misleading" | "Unverified";
  summary: string;
  explanation: string;
  region: string;
  publishedAt: string;
  evidence: SourceLink[];
};

export type Topic = {
  name: string;
  slug: string;
  summary: string;
};

export type TimelineEvent = {
  slug: string;
  topicSlug: string;
  title: string;
  update: string;
  eventAt: string;
  sourceLinks: SourceLink[];
};

export const categories: Category[] = [
  { name: "National", slug: "national", accent: "#8b1f1f" },
  { name: "World", slug: "world", accent: "#123f6b" },
  { name: "Business", slug: "business", accent: "#20503e" },
  { name: "Technology", slug: "technology", accent: "#4d2a7a" },
  { name: "Sport", slug: "sport", accent: "#8a4a11" },
  { name: "Opinion", slug: "opinion", accent: "#6a3e24" },
];

export const topics: Topic[] = [
  {
    name: "Monsoon Watch 2026",
    slug: "monsoon-watch-2026",
    summary: "Tracking rainfall outlook, reservoir levels, and district preparedness across India.",
  },
  {
    name: "India AI Race",
    slug: "india-ai-race",
    summary: "Follow policy moves, startup momentum, and chip infrastructure updates in India.",
  },
  {
    name: "Urban Mobility",
    slug: "urban-mobility",
    summary: "Transit policy, metro expansion, and city commute reforms in major metros.",
  },
];

export const newsArticles: NewsArticle[] = [
  {
    title: "Metro corridors expand as city unveils a new affordable pass",
    slug: "metro-corridors-expand-affordable-pass",
    summary:
      "The transport authority announces a two-tier monthly pass that lowers costs for regular commuters and students.",
    coverImageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80",
    category: "national",
    author: "Ananya Menon",
    location: "Chennai",
    publishedAt: "Mar 11, 2026",
    readTime: "6 min read",
    featured: true,
    trending: true,
    topic: { name: "Urban Mobility", slug: "urban-mobility" },
    whyItMatters: [
      "Lower commuter costs can directly improve monthly household budgets.",
      "Affordable public transport often reduces road congestion and emissions.",
    ],
    whatChanged: [
      "A new monthly pass now offers unlimited off-peak rides.",
      "Students get additional discounts during weekday peak slots.",
    ],
    whatNext: [
      "Implementation starts from the next billing cycle.",
      "State transport officials plan a six-month impact review.",
    ],
    sixtySecondBrief: [
      "Chennai introduces a new metro pass with discounted travel for frequent users.",
      "Students and off-peak commuters gain the most from the revised structure.",
      "Experts say last-mile feeder transport still needs urgent improvement.",
    ],
    sourceLinks: [
      { label: "State Transport Circular", url: "https://example.com/state-transport-circular" },
      { label: "Commuter Survey Note", url: "https://example.com/commuter-survey-note" },
    ],
    lastVerified: "Mar 11, 2026, 7:15 PM IST",
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
    coverImageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80",
    category: "world",
    author: "Ritika Suri",
    location: "New Delhi",
    publishedAt: "Mar 11, 2026",
    readTime: "5 min read",
    trending: true,
    whyItMatters: [
      "Supply chain reliability affects inflation, medicine access, and manufacturing jobs.",
      "India's export competitiveness depends on stable component sourcing.",
    ],
    whatChanged: [
      "India proposed coordinated inventory planning for critical sectors.",
      "Delegates agreed to accelerate digital customs procedures.",
    ],
    whatNext: [
      "A progress review is expected before the June ministerial meeting.",
      "Member states will release sector-specific coordination notes this quarter.",
    ],
    sixtySecondBrief: [
      "India and ASEAN are pushing for stronger supply chain cooperation.",
      "Priority sectors include semiconductors, pharma, and logistics.",
      "Policy outcomes will be reviewed in the next ministerial round.",
    ],
    sourceLinks: [{ label: "Dialogue Brief", url: "https://example.com/dialogue-brief" }],
    lastVerified: "Mar 11, 2026, 8:05 PM IST",
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
    coverImageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80",
    category: "business",
    author: "Nikhil Jain",
    location: "Mumbai",
    publishedAt: "Mar 10, 2026",
    readTime: "4 min read",
    trending: true,
    topic: { name: "India AI Race", slug: "india-ai-race" },
    sixtySecondBrief: [
      "SMEs are using affordable AI tools for demand forecasting.",
      "Pilots report lower overstock and improved production planning.",
      "Experts warn logistics and credit access remain bottlenecks.",
    ],
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
    coverImageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    category: "technology",
    author: "Farah Ali",
    location: "Bengaluru",
    publishedAt: "Mar 10, 2026",
    readTime: "7 min read",
    topic: { name: "India AI Race", slug: "india-ai-race" },
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
    coverImageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=80",
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
    coverImageUrl: "https://images.unsplash.com/photo-1470163395405-d2b80e7450ed?auto=format&fit=crop&w=1600&q=80",
    category: "opinion",
    author: "Editorial Board",
    location: "Byte Bulletin Desk",
    publishedAt: "Mar 9, 2026",
    readTime: "8 min read",
    topic: { name: "Monsoon Watch 2026", slug: "monsoon-watch-2026" },
    content: [
      "City administrations increasingly frame climate action as a communication priority, but policy execution depends on annual budgets with measurable outcomes. Without budget-linked goals, adaptation remains fragmented.",
      "Heat shelters, stormwater upgrades and cooling corridors require predictable financing cycles. A transparent municipal climate ledger can help citizens track progress and hold elected representatives accountable.",
      "The next decade will test whether cities can integrate climate adaptation into everyday planning rather than treating it as a parallel agenda.",
    ],
  },
];

export const videoStories: VideoStory[] = [
  {
    title: "The hopes and fears of Iranians in Germany",
    slug: "hopes-and-fears-of-iranians-in-germany",
    summary: "A ground report on how diaspora communities are reacting to regional instability.",
    youtubeUrl: "https://www.youtube.com/watch?v=uhQqJPACByg",
    source: "DW News",
    category: "world",
    publishedAt: "Mar 12, 2026",
    featured: true,
  },
  {
    title: "Iran war: Environmental and health hazard for the Middle East",
    slug: "iran-war-environmental-and-health-hazard",
    summary: "An explainer on health, environment, and oil market disruption during conflict.",
    youtubeUrl: "https://www.youtube.com/watch?v=-WlExaMJyDo",
    source: "DW News",
    category: "world",
    publishedAt: "Mar 12, 2026",
  },
  {
    title: "How Russia seeks economic and strategic gains from the Iran war",
    slug: "russia-economic-strategic-gains-iran-war",
    summary: "Analysis of energy economics, geopolitics, and alliance dynamics.",
    youtubeUrl: "https://www.youtube.com/watch?v=yTj5NNy0zLQ",
    source: "DW News",
    category: "business",
    publishedAt: "Mar 12, 2026",
  },
];

export const factChecks: FactCheckItem[] = [
  {
    title: "Viral claim says UPI transactions are taxed from April",
    slug: "upi-transactions-taxed-from-april",
    claim: "Government will impose direct tax on every UPI transaction from April.",
    verdict: "False",
    summary: "No notification from RBI or Finance Ministry supports this claim.",
    explanation:
      "Official advisories confirm no per-transaction tax has been introduced for routine UPI payments. The viral post misreads a discussion paper as a final rule.",
    region: "India",
    publishedAt: "Mar 12, 2026",
    evidence: [
      { label: "RBI Clarification", url: "https://example.com/rbi-clarification" },
      { label: "Finance Ministry FAQ", url: "https://example.com/finmin-faq" },
    ],
  },
  {
    title: "Heatwave rumor links school closure order to IMD red alert",
    slug: "heatwave-school-closure-rumor",
    claim: "All schools in North India are ordered shut due to nationwide red alert.",
    verdict: "Misleading",
    summary: "State-level advisories vary; there is no single national closure order.",
    explanation:
      "District administrations can issue temporary closures based on local heat conditions. The social post presents local advisories as a nationwide directive.",
    region: "India",
    publishedAt: "Mar 11, 2026",
    evidence: [{ label: "IMD Bulletin", url: "https://example.com/imd-bulletin" }],
  },
  {
    title: "Post claims Aadhaar is mandatory for all train ticket bookings",
    slug: "aadhaar-mandatory-all-train-bookings",
    claim: "Rail passengers cannot book tickets without Aadhaar verification.",
    verdict: "Unverified",
    summary: "Current public circulars do not confirm this as a universal requirement.",
    explanation:
      "Some optional verification workflows exist for specific quota and account protection flows. A universal mandatory rollout is not confirmed in official public notices yet.",
    region: "India",
    publishedAt: "Mar 10, 2026",
    evidence: [{ label: "Railways Public Notice", url: "https://example.com/railways-notice" }],
  },
];

export const timelineEvents: TimelineEvent[] = [
  {
    slug: "monsoon-watch-forecast-revision",
    topicSlug: "monsoon-watch-2026",
    title: "IMD updates seasonal rainfall outlook",
    update: "Forecast revised upward for select eastern coastal districts after new ocean temperature readings.",
    eventAt: "Mar 12, 2026, 10:30 AM IST",
    sourceLinks: [{ label: "IMD Update", url: "https://example.com/imd-update" }],
  },
  {
    slug: "ai-race-semicon-cluster",
    topicSlug: "india-ai-race",
    title: "New AI chip design cluster announced",
    update: "A consortium of startups and institutes announced a shared design lab for low-power inference chips.",
    eventAt: "Mar 11, 2026, 3:00 PM IST",
    sourceLinks: [{ label: "Industry Consortium Note", url: "https://example.com/consortium-note" }],
  },
  {
    slug: "urban-mobility-pass-rollout",
    topicSlug: "urban-mobility",
    title: "Metro authority confirms discounted pass rollout",
    update: "Student and off-peak commuter slabs are officially included in the first rollout window.",
    eventAt: "Mar 11, 2026, 8:15 PM IST",
    sourceLinks: [{ label: "Transport Authority Release", url: "https://example.com/metro-release" }],
  },
  {
    slug: "urban-mobility-feeder-review",
    topicSlug: "urban-mobility",
    title: "Feeder connectivity review committee formed",
    update: "A technical committee will evaluate bus-feeder and pedestrian safety integration in major stations.",
    eventAt: "Mar 12, 2026, 9:45 AM IST",
    sourceLinks: [{ label: "City Mobility Department", url: "https://example.com/mobility-department" }],
  },
];

const defaultVideoStory: VideoStory = {
  title: "Global headlines in brief",
  slug: "global-headlines-in-brief",
  summary: "A short roundup of today's biggest global developments.",
  youtubeUrl: "https://www.youtube.com/watch?v=uhQqJPACByg",
  source: "DW News",
  category: "world",
  publishedAt: "Mar 12, 2026",
};

const categoryImageFallbacks: Record<string, string> = {
  national: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80",
  world: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80",
  business: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80",
  technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
  sport: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=80",
  opinion: "https://images.unsplash.com/photo-1470163395405-d2b80e7450ed?auto=format&fit=crop&w=1600&q=80",
};

export function resolveStoryImage(article: Pick<NewsArticle, "coverImageUrl" | "category">) {
  return article.coverImageUrl || categoryImageFallbacks[article.category] || categoryImageFallbacks.national;
}

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

export function getFeaturedVideo() {
  return videoStories.find((video) => video.featured) ?? videoStories[0] ?? defaultVideoStory;
}

export function getLatestVideos(limit = 3) {
  return videoStories.length > 0 ? videoStories.slice(0, limit) : [defaultVideoStory];
}

export function getFactChecks(limit = 4) {
  return factChecks.slice(0, limit);
}

export function getTopicCards(limit = 6) {
  return topics.slice(0, limit);
}

export function getTopicBySlug(slug: string) {
  return topics.find((topic) => topic.slug === slug);
}

export function getTopicTimeline(slug: string, limit = 20) {
  return timelineEvents.filter((event) => event.topicSlug === slug).slice(0, limit);
}
