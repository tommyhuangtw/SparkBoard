"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import type { BusinessIdea } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SubredditBarChartProps {
  ideas: BusinessIdea[];
}

export function SubredditBarChart({ ideas }: SubredditBarChartProps) {
  const data = useMemo(() => {
    const bySubreddit: Record<string, { count: number; totalScore: number }> =
      {};

    ideas.filter((i) => i.subreddit).forEach((idea) => {
      if (!bySubreddit[idea.subreddit]) {
        bySubreddit[idea.subreddit] = { count: 0, totalScore: 0 };
      }
      bySubreddit[idea.subreddit].count++;
      bySubreddit[idea.subreddit].totalScore += idea.scores.total;
    });

    return Object.entries(bySubreddit)
      .map(([name, { count, totalScore }]) => ({
        name: `r/${name}`,
        數量: count,
        平均分: Math.round((totalScore / count) * 10) / 10,
      }))
      .sort((a, b) => b.數量 - a.數量);
  }, [ideas]);

  return (
    <Card className="p-4">
      <h3 className="mb-4 text-sm font-semibold">Subreddit 分佈</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              horizontal={false}
            />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11 }}
              width={120}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="數量"
              fill="hsl(var(--chart-1))"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
