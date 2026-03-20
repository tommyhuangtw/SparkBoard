"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { ScoreBadge } from "@/components/shared/score-badge";
import { SourceBadge } from "@/components/shared/source-badge";
import { Trophy, TrendingUp, Lightbulb } from "lucide-react";
import type { BusinessIdea } from "@/lib/types";
import { format } from "date-fns";

interface DailySummaryProps {
  ideas: BusinessIdea[];
  onSelect: (idea: BusinessIdea) => void;
}

export function DailySummary({ ideas, onSelect }: DailySummaryProps) {
  const { dateLabel, topIdeas, avgScore, count } = useMemo(() => {
    if (ideas.length === 0) {
      return { dateLabel: "N/A", topIdeas: [], avgScore: 0, count: 0 };
    }

    // Find the most recent date
    const sorted = [...ideas].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const latestDate = sorted[0].date.split("T")[0];
    const todayIdeas = ideas.filter((i) => i.date.startsWith(latestDate));

    const top = [...todayIdeas]
      .sort((a, b) => b.scores.total - a.scores.total)
      .slice(0, 3);

    const avg =
      todayIdeas.length > 0
        ? todayIdeas.reduce((s, i) => s + i.scores.total, 0) /
          todayIdeas.length
        : 0;

    return {
      dateLabel: format(new Date(latestDate), "yyyy 年 MM 月 dd 日"),
      topIdeas: top,
      avgScore: Math.round(avg * 10) / 10,
      count: todayIdeas.length,
    };
  }, [ideas]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">每日摘要</h3>
        <span className="text-sm text-muted-foreground">{dateLabel}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="flex items-center gap-3 p-4">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <div>
            <p className="text-xs text-muted-foreground">收錄點子</p>
            <p className="font-mono text-xl font-bold">{count}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          <div>
            <p className="text-xs text-muted-foreground">平均總分</p>
            <p className="font-mono text-xl font-bold">{avgScore}</p>
          </div>
        </Card>
      </div>

      <h4 className="flex items-center gap-2 text-sm font-semibold">
        <Trophy className="h-4 w-4 text-amber-500" />
        今日 Top 3
      </h4>

      <div className="space-y-3">
        {topIdeas.map((idea, i) => (
          <Card
            key={idea.id}
            className="cursor-pointer p-4 transition-all hover:border-primary/30"
            onClick={() => onSelect(idea)}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 font-mono text-2xl font-bold text-muted-foreground/50">
                {i + 1}
              </span>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h5 className="text-sm font-semibold leading-snug">
                    {idea.titleZh || idea.title}
                  </h5>
                  <ScoreBadge score={idea.scores.total} size="md" />
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {idea.summary}
                </p>
                <div className="flex items-center gap-2">
                  <SourceBadge source={idea.source} />
                  <span className="text-xs text-muted-foreground">
                    {idea.upvotes} 按讚
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {topIdeas.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-sm text-muted-foreground">暫無資料</p>
          </Card>
        )}
      </div>
    </div>
  );
}
