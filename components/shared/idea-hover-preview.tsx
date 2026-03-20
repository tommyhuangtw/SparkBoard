"use client";

import type { ReactNode } from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/shared/score-badge";
import { SourceBadge } from "@/components/shared/source-badge";
import { Separator } from "@/components/ui/separator";
import { getTagColor } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { BusinessIdea } from "@/lib/types";

interface IdeaHoverPreviewProps {
  idea: BusinessIdea;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

export function IdeaHoverPreview({
  idea,
  children,
  side = "right",
}: IdeaHoverPreviewProps) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger
        openOnHover
        delay={400}
        nativeButton={false}
        render={<div />}
        className="w-full"
      >
        {children}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          side={side}
          align="start"
          sideOffset={8}
          className="isolate z-50"
        >
          <PopoverPrimitive.Popup className="w-96 rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 origin-(--transform-origin) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
            <div className="max-h-[60vh] overflow-y-auto overscroll-contain p-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold leading-snug">
                  {idea.titleZh || idea.title}
                </h4>
                <ScoreBadge score={idea.scores.total} size="md" />
              </div>

              {/* Source */}
              <div className="mt-1.5">
                <SourceBadge source={idea.source} />
              </div>

              {/* Scores */}
              <div className="mt-2 flex flex-wrap gap-1">
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

              {/* Tags */}
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

              <Separator className="my-3" />

              {/* Summary */}
              {idea.summary && (
                <div className="space-y-1">
                  <h5 className="text-xs font-semibold text-muted-foreground">
                    重點整理
                  </h5>
                  <p className="line-clamp-4 text-xs leading-relaxed">
                    {idea.summary}
                  </p>
                </div>
              )}

              {/* Business Analysis */}
              {idea.businessAnalysis && (
                <div className="mt-3 space-y-1">
                  <h5 className="text-xs font-semibold text-muted-foreground">
                    商業機會分析
                  </h5>
                  <p className="line-clamp-4 text-xs leading-relaxed">
                    {idea.businessAnalysis}
                  </p>
                </div>
              )}

              {/* Threads Angle */}
              {idea.threadsAngle && (
                <div className="mt-3 space-y-1">
                  <h5 className="text-xs font-semibold text-muted-foreground">
                    Threads 切入角度
                  </h5>
                  <p className="line-clamp-3 text-xs leading-relaxed">
                    {idea.threadsAngle}
                  </p>
                </div>
              )}
            </div>
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
