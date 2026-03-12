import { NextResponse } from "next/server";
import { fetchYouTubeNewsVideos } from "@/lib/youtube-rss";

export const revalidate = 3600;

export async function GET() {
  const videos = await fetchYouTubeNewsVideos(15);

  return NextResponse.json({
    source: "youtube-rss",
    count: videos.length,
    videos,
  });
}
