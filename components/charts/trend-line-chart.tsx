"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import type { BusinessIdea } from "@/lib/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format } from "date-fns";

interface TrendLineChartProps {
  ideas: BusinessIdea[];
}

export function TrendLineChart({ ideas }: TrendLineChartProps) {
  const data = useMemo(() => {
    const byDate: Record<
      string,
      { total: number[]; feasibility: number[]; commerciality: number[]; novelty: number[] }
    > = {};

    ideas.forEach((idea) => {
      const date = idea.date.split("T")[0];
      if (!byDate[date]) {
        byDate[date] = { total: [], feasibility: [], commerciality: [], novelty: [] };
      }
      byDate[date].total.push(idea.scores.total);
      byDate[date].feasibility.push(idea.scores.feasibility);
      byDate[date].commerciality.push(idea.scores.commerciality);
      byDate[date].novelty.push(idea.scores.novelty);
    });

    return Object.entries(byDate)
      .map(([date, scores]) => ({
        date,
        label: format(new Date(date), "MM/dd"),
        總分: Math.round((scores.total.reduce((a, b) => a + b, 0) / scores.total.length) * 10) / 10,
        可行性: Math.round((scores.feasibility.reduce((a, b) => a + b, 0) / scores.feasibility.length) * 10) / 10,
        商業性: Math.round((scores.commerciality.reduce((a, b) => a + b, 0) / scores.commerciality.length) * 10) / 10,
        新穎性: Math.round((scores.novelty.reduce((a, b) => a + b, 0) / scores.novelty.length) * 10) / 10,
        count: scores.total.length,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [ideas]);

  return (
    <Card className="p-4">
      <h3 className="mb-4 text-sm font-semibold">分數趨勢</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="總分" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="可行性" stroke="hsl(var(--chart-2))" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="商業性" stroke="hsl(var(--chart-3))" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="新穎性" stroke="hsl(var(--chart-4))" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
