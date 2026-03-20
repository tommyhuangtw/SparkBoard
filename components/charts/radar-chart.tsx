"use client";

import { Card } from "@/components/ui/card";
import type { BusinessIdea } from "@/lib/types";
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface IdeaRadarChartProps {
  idea: BusinessIdea | null;
  comparisonIdea?: BusinessIdea | null;
}

export function IdeaRadarChart({ idea, comparisonIdea }: IdeaRadarChartProps) {
  if (!idea) {
    return (
      <Card className="flex h-72 items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">選擇一個點子查看雷達圖</p>
      </Card>
    );
  }

  const data = [
    { subject: "可行性", A: idea.scores.feasibility, B: comparisonIdea?.scores.feasibility },
    { subject: "商業性", A: idea.scores.commerciality, B: comparisonIdea?.scores.commerciality },
    { subject: "新穎性", A: idea.scores.novelty, B: comparisonIdea?.scores.novelty },
    { subject: "社群吸引力", A: idea.scores.threadsAttraction, B: comparisonIdea?.scores.threadsAttraction },
    { subject: "台灣適用", A: idea.scores.taiwanMarketFit, B: comparisonIdea?.scores.taiwanMarketFit },
  ];

  return (
    <Card className="p-4">
      <h3 className="mb-2 text-sm font-semibold">分數雷達圖</h3>
      <p className="mb-3 line-clamp-1 text-xs text-muted-foreground">
        {idea.titleZh || idea.title}
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <RechartsRadarChart data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.15)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <PolarRadiusAxis angle={90} domain={[0, 10]} tick={false} axisLine={false} />
            <Radar
              name={(idea.titleZh || idea.title).slice(0, 20)}
              dataKey="A"
              stroke="#38bdf8"
              fill="#38bdf8"
              fillOpacity={0.6}
            />
            {comparisonIdea && (
              <Radar
                name={comparisonIdea.title.slice(0, 20)}
                dataKey="B"
                stroke="hsl(var(--chart-2))"
                fill="hsl(var(--chart-2))"
                fillOpacity={0.2}
              />
            )}
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
