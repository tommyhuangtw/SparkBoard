"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScoreBadge } from "@/components/shared/score-badge";
import { ExternalLink, MessageSquare, ThumbsUp, Calendar } from "lucide-react";
import { SCORE_LABELS, getTagColor } from "@/lib/constants";
import type { BusinessIdea } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SourceBadge } from "@/components/shared/source-badge";
import { format } from "date-fns";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface IdeaDetailDialogProps {
  idea: BusinessIdea | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IdeaDetailDialog({
  idea,
  open,
  onOpenChange,
}: IdeaDetailDialogProps) {
  if (!idea) return null;

  const radarData = [
    { subject: "可行性", value: idea.scores.feasibility, fullMark: 10 },
    { subject: "商業性", value: idea.scores.commerciality, fullMark: 10 },
    { subject: "新穎性", value: idea.scores.novelty, fullMark: 10 },
    { subject: "社群吸引力", value: idea.scores.threadsAttraction, fullMark: 10 },
    { subject: "台灣適用", value: idea.scores.taiwanMarketFit, fullMark: 10 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <SourceBadge source={idea.source} size="md" />
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {idea.date ? format(new Date(idea.date), "yyyy-MM-dd") : "-"}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ThumbsUp className="h-3 w-3" />
              {idea.upvotes}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              {idea.commentCount}
            </span>
          </div>
          {idea.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {idea.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={cn("text-xs", getTagColor(tag))}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <DialogTitle className="text-lg leading-tight">
            {idea.titleZh || idea.title}
          </DialogTitle>
        </DialogHeader>

        {/* Score Radar */}
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <div className="h-48 w-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.15)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 10]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  dataKey="value"
                  stroke="#38bdf8"
                  fill="#38bdf8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2">
            <ScoreBadge score={idea.scores.total} label="總分" size="md" />
            {(
              Object.entries(idea.scores) as [string, number][]
            ).map(
              ([key, val]) =>
                key !== "total" && (
                  <ScoreBadge
                    key={key}
                    score={val}
                    label={SCORE_LABELS[key]}
                    size="sm"
                  />
                )
            )}
          </div>
        </div>

        <Separator />

        {/* Summary */}
        {idea.summary && (
          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold">重點整理</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {idea.summary}
            </p>
          </div>
        )}

        {/* Business Analysis */}
        {idea.businessAnalysis && (
          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold">商業機會分析</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {idea.businessAnalysis}
            </p>
          </div>
        )}

        {/* Threads Angle */}
        {idea.threadsAngle && (
          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold">Threads 切入角度</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {idea.threadsAngle}
            </p>
          </div>
        )}

        <Separator />

        {/* Link */}
        {(idea.redditUrl || idea.xUrl || idea.fbUrl || idea.originalUrl) && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<a href={
                idea.source === "x" ? (idea.xUrl || idea.originalUrl) :
                idea.source === "facebook" ? (idea.fbUrl || idea.originalUrl) :
                (idea.redditUrl || idea.originalUrl)
              } target="_blank" rel="noopener noreferrer" />}
            >
              <ExternalLink className="mr-1.5 h-3 w-3" />
              {idea.source === "x" ? "X 連結" : idea.source === "facebook" ? "Facebook 連結" : "Reddit 連結"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
