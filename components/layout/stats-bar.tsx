"use client";

import { useMemo } from "react";
import {
  Lightbulb,
  TrendingUp,
  CalendarPlus,
  Hash,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import type { BusinessIdea } from "@/lib/types";

interface StatsBarProps {
  ideas: BusinessIdea[];
}

export function StatsBar({ ideas }: StatsBarProps) {
  const stats = useMemo(() => {
    if (ideas.length === 0) {
      return {
        total: 0,
        avgScore: 0,
        todayCount: 0,
        sourceCount: 0,
      };
    }

    const avgScore =
      ideas.reduce((sum, i) => sum + i.scores.total, 0) / ideas.length;

    const todayStr = new Date().toISOString().split("T")[0];
    const todayCount = ideas.filter((i) => i.date.startsWith(todayStr)).length;

    const sourceCount = new Set(ideas.map((i) => i.source)).size;

    return {
      total: ideas.length,
      avgScore: Math.round(avgScore * 10) / 10,
      todayCount,
      sourceCount,
    };
  }, [ideas]);

  const items = [
    {
      icon: Lightbulb,
      label: "總點子數",
      value: stats.total,
      color: "text-amber-500",
    },
    {
      icon: TrendingUp,
      label: "平均總分",
      value: stats.avgScore,
      color: "text-emerald-500",
    },
    {
      icon: CalendarPlus,
      label: "今日新增",
      value: stats.todayCount,
      color: "text-sky-500",
    },
    {
      icon: Hash,
      label: "資料來源",
      value: stats.sourceCount,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="flex items-center gap-3 p-4">
          <div className={`rounded-lg bg-muted p-2 ${item.color}`}>
            <item.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
            <p className="font-mono text-2xl font-bold">{item.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
