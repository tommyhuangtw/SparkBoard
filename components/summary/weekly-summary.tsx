"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { ScoreBadge } from "@/components/shared/score-badge";
import { SourceBadge } from "@/components/shared/source-badge";
import {
  Trophy,
  TrendingUp,
  Lightbulb,
  BarChart3,
} from "lucide-react";
import type { BusinessIdea } from "@/lib/types";

interface WeeklySummaryProps {
  ideas: BusinessIdea[];
  onSelect: (idea: BusinessIdea) => void;
}

export function WeeklySummary({ ideas, onSelect }: WeeklySummaryProps) {
  const { topIdeas, avgScore, count, highScoreCount, sourceCount } =
    useMemo(() => {
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const weekIdeas = ideas.filter(
        (i) => new Date(i.date) >= weekAgo
      );

      const top = [...weekIdeas]
        .sort((a, b) => b.scores.total - a.scores.total)
        .slice(0, 5);

      const avg =
        weekIdeas.length > 0
          ? weekIdeas.reduce((s, i) => s + i.scores.total, 0) /
            weekIdeas.length
          : 0;

      const highScore = weekIdeas.filter((i) => i.scores.total >= 80).length;

      const sourceCounts: Record<string, number> = {};
      weekIdeas.forEach((i) => {
        sourceCounts[i.source] = (sourceCounts[i.source] || 0) + 1;
      });

      return {
        topIdeas: top,
        avgScore: Math.round(avg * 10) / 10,
        count: weekIdeas.length,
        highScoreCount: highScore,
        sourceCount: Object.keys(sourceCounts).length,
      };
    }, [ideas]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">本週摘要</h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="flex items-center gap-3 p-4">
          <Lightbulb className="h-4 w-4 shrink-0 text-amber-500" />
          <div>
            <p className="text-xs text-muted-foreground">總點子</p>
            <p className="font-mono text-lg font-bold">{count}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <TrendingUp className="h-4 w-4 shrink-0 text-emerald-500" />
          <div>
            <p className="text-xs text-muted-foreground">平均分</p>
            <p className="font-mono text-lg font-bold">{avgScore}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <BarChart3 className="h-4 w-4 shrink-0 text-sky-500" />
          <div>
            <p className="text-xs text-muted-foreground">高分 (80+)</p>
            <p className="font-mono text-lg font-bold">{highScoreCount}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <BarChart3 className="h-4 w-4 shrink-0 text-purple-500" />
          <div>
            <p className="text-xs text-muted-foreground">資料來源</p>
            <p className="font-mono text-lg font-bold">
              {sourceCount}
            </p>
          </div>
        </Card>
      </div>

      {/* Top ideas */}
      <h4 className="flex items-center gap-2 text-sm font-semibold">
        <Trophy className="h-4 w-4 text-amber-500" />
        本週 Top 5
      </h4>

      <div className="space-y-2">
        {topIdeas.map((idea, i) => (
          <Card
            key={idea.id}
            className="cursor-pointer p-3 transition-all hover:border-primary/30"
            onClick={() => onSelect(idea)}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-bold text-muted-foreground/50">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h5 className="line-clamp-1 text-sm font-medium">
                  {idea.titleZh || idea.title}
                </h5>
                <div className="mt-1 flex items-center gap-2">
                  <SourceBadge source={idea.source} />
                  <span className="text-xs text-muted-foreground">
                    {idea.upvotes} 按讚
                  </span>
                </div>
              </div>
              <ScoreBadge score={idea.scores.total} size="md" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
