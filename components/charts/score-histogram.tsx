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

interface ScoreHistogramProps {
  ideas: BusinessIdea[];
}

export function ScoreHistogram({ ideas }: ScoreHistogramProps) {
  const data = useMemo(() => {
    const buckets: Record<string, number> = {};
    const ranges = ["0-50", "50-60", "60-70", "70-80", "80-90", "90-100"];
    ranges.forEach((r) => (buckets[r] = 0));

    ideas.forEach((idea) => {
      const s = idea.scores.total;
      if (s < 50) buckets["0-50"]++;
      else if (s < 60) buckets["50-60"]++;
      else if (s < 70) buckets["60-70"]++;
      else if (s < 80) buckets["70-80"]++;
      else if (s < 90) buckets["80-90"]++;
      else buckets["90-100"]++;
    });

    return ranges.map((range) => ({ range, 數量: buckets[range] }));
  }, [ideas]);

  return (
    <Card className="p-4">
      <h3 className="mb-4 text-sm font-semibold">總分分佈</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
            />
            <XAxis dataKey="range" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
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
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
