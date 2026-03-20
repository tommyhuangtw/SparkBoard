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

interface TagBarChartProps {
  ideas: BusinessIdea[];
}

export function TagBarChart({ ideas }: TagBarChartProps) {
  const data = useMemo(() => {
    const byTag: Record<string, { count: number; totalScore: number }> = {};

    ideas.forEach((idea) => {
      idea.tags.forEach((tag) => {
        if (!byTag[tag]) {
          byTag[tag] = { count: 0, totalScore: 0 };
        }
        byTag[tag].count++;
        byTag[tag].totalScore += idea.scores.total;
      });
    });

    return Object.entries(byTag)
      .map(([name, { count, totalScore }]) => ({
        name,
        數量: count,
        平均分: Math.round((totalScore / count) * 10) / 10,
      }))
      .sort((a, b) => b.數量 - a.數量);
  }, [ideas]);

  return (
    <Card className="p-4">
      <h3 className="mb-4 text-sm font-semibold">標籤分佈</h3>
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
              width={90}
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
              fill="hsl(var(--chart-2))"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
