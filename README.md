# Byte Bulletin

Byte Bulletin is a free-first news website starter built with Next.js and a newspaper-style UI.

## Stack

- Next.js 16 (App Router + TypeScript)
- Tailwind CSS
- Sanity CMS (free tier)
- Vercel (hobby) deployment ready

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Copy environment file:

```bash
cp .env.example .env.local
```

3. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Sanity CMS Setup (Free)

1. Create a free account at https://www.sanity.io.
2. Create a project and dataset.
3. Add values to `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
GNEWS_API_KEY=your_gnews_api_key
YOUTUBE_NEWS_CHANNEL_IDS=UCNye-wNBqNL5ZzHSJj3l8Bg,UCknLrEdhRCp1aegoMqRaCZg
```

4. Open Studio at `http://localhost:3000/studio`.

The app uses fallback local content if Sanity env values are not set, so it works immediately.

## Routes

- `/` home page
- `/news/[slug]` article page
- `/category/[slug]` category index
- `/search` search index page
- `/videos` video bulletin page
- `/studio` Sanity Studio
- `/api/daily-news` cached GNews JSON feed
- `/api/daily-videos` cached YouTube RSS video feed

## Video Bulletin Setup

- In Sanity Studio, create `Video Story` documents.
- Add a valid YouTube URL, source/channel name, category, published date and optional featured flag.
- The homepage and `/videos` page merge these entries with auto-fetched videos from selected channels.
- Configure RSS channels via `YOUTUBE_NEWS_CHANNEL_IDS` in `.env.local`.
- Use `/videos?source=dw-news` style filters from the source chips on the page.

## Free Growth Checklist

- Connect Vercel Hobby for deployment.
- Configure Google Search Console.
- Add newsletter with Resend free tier.
- Add image CDN with Cloudinary free tier.
