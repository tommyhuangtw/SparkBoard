import { NextRequest, NextResponse } from "next/server";
import { fetchIdeas } from "@/lib/google-sheets";
import type { BusinessIdea } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const ideas = await fetchIdeas();
    const period = request.nextUrl.searchParams.get("period") || "daily";

    const now = new Date();
    let filteredIdeas: BusinessIdea[];

    if (period === "weekly") {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredIdeas = ideas.filter((i) => new Date(i.date) >= weekAgo);
    } else {
      const todayStr = now.toISOString().split("T")[0];
      filteredIdeas = ideas.filter((i) => i.date.startsWith(todayStr));
      // If no data today, use most recent date
      if (filteredIdeas.length === 0 && ideas.length > 0) {
        const sorted = [...ideas].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        const latestDate = sorted[0].date.split("T")[0];
        filteredIdeas = ideas.filter((i) => i.date.startsWith(latestDate));
      }
    }

    const topIdeas = [...filteredIdeas]
      .sort((a, b) => b.scores.total - a.scores.total)
      .slice(0, period === "weekly" ? 5 : 3);

    const avgScore =
      filteredIdeas.length > 0
        ? filteredIdeas.reduce((sum, i) => sum + i.scores.total, 0) /
          filteredIdeas.length
        : 0;

    const subredditCounts: Record<string, number> = {};
    filteredIdeas.forEach((i) => {
      subredditCounts[i.subreddit] = (subredditCounts[i.subreddit] || 0) + 1;
    });
    const topSubreddit =
      Object.entries(subredditCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "N/A";

    return NextResponse.json({
      period,
      totalIdeas: filteredIdeas.length,
      avgScore: Math.round(avgScore * 10) / 10,
      topIdeas,
      topSubreddit,
      subredditCounts,
    });
  } catch (error) {
    console.error("Failed to compute summary:", error);
    return NextResponse.json(
      { error: "Failed to compute summary" },
      { status: 500 }
    );
  }
}
