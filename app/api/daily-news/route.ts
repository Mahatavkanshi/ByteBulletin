import { NextResponse } from "next/server";
import { fetchGNewsHeadlines } from "@/lib/gnews";

export const revalidate = 1800;

export async function GET() {
  const headlines = await fetchGNewsHeadlines(10);

  return NextResponse.json({
    source: "gnews",
    count: headlines.length,
    headlines,
  });
}
