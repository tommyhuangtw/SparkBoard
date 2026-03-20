"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/shared/score-badge";
import { ThumbsUp, MessageSquare } from "lucide-react";
import type { BusinessIdea } from "@/lib/types";
import { extractFirstSentence, cn } from "@/lib/utils";
import { getTagColor } from "@/lib/constants";
import { IdeaHoverPreview } from "@/components/shared/idea-hover-preview";
import { SourceBadge } from "@/components/shared/source-badge";
import { format } from "date-fns";

interface IdeaCardProps {
  idea: BusinessIdea;
  rank: number;
  onClick: () => void;
}

export function IdeaCard({ idea, rank, onClick }: IdeaCardProps) {
  return (
    <IdeaHoverPreview idea={idea}>
    <Card
      className="cursor-pointer p-4 transition-all hover:border-primary/30 hover:shadow-md"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 font-mono text-lg font-bold text-muted-foreground">
            {rank}
          </span>
          <div className="space-y-1.5">
            <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug">
              {idea.titleZh || idea.title}
            </h3>
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {extractFirstSentence(idea.summary)}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <SourceBadge source={idea.source} />
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <ThumbsUp className="h-3.5 w-3.5" />
                {idea.upvotes}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5" />
                {idea.commentCount}
              </span>
              <span className="text-sm text-muted-foreground">
                {idea.date ? format(new Date(idea.date), "MM/dd") : ""}
              </span>
            </div>
          </div>
        </div>
        <ScoreBadge score={idea.scores.total} size="md" />
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
        {idea.summary}
      </p>
      <div className="mt-3 flex flex-wrap gap-1">
        {(
          [
            ["可行", idea.scores.feasibility],
            ["商業", idea.scores.commerciality],
            ["新穎", idea.scores.novelty],
            ["社群", idea.scores.threadsAttraction],
            ["台灣", idea.scores.taiwanMarketFit],
          ] as [string, number][]
        ).map(([label, score]) => (
          <ScoreBadge key={label} score={score} label={label} />
        ))}
      </div>
      {idea.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
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
    </Card>
    </IdeaHoverPreview>
  );
}
