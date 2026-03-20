import { NextResponse } from "next/server";
import { fetchIdeas } from "@/lib/google-sheets";
import type { IdeasResponse } from "@/lib/types";

export async function GET() {
  try {
    const ideas = await fetchIdeas();

    const subreddits = [...new Set(ideas.map((i) => i.subreddit).filter(Boolean))];
    const tags = [...new Set(ideas.flatMap((i) => i.tags).filter(Boolean))].sort();
    const sources = [...new Set(ideas.map((i) => i.source).filter(Boolean))];

    const response: IdeasResponse = {
      ideas,
      lastUpdated: new Date().toISOString(),
      meta: {
        totalCount: ideas.length,
        subreddits,
        tags,
        sources,
      },
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("Failed to fetch ideas:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from Google Sheets" },
      { status: 500 }
    );
  }
}
