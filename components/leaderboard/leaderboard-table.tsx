"use client";

import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/shared/score-badge";
import type { BusinessIdea, SortField } from "@/lib/types";
import { SCORE_LABELS, getTagColor } from "@/lib/constants";
import { cn, extractFirstSentence } from "@/lib/utils";
import { IdeaHoverPreview } from "@/components/shared/idea-hover-preview";
import { SourceBadge } from "@/components/shared/source-badge";
import { format } from "date-fns";

interface LeaderboardTableProps {
  ideas: BusinessIdea[];
  sortBy: SortField;
  sortOrder: "asc" | "desc";
  onSort: (field: SortField) => void;
  onSelect: (idea: BusinessIdea) => void;
}

function SortIcon({
  field,
  sortBy,
  sortOrder,
}: {
  field: SortField;
  sortBy: SortField;
  sortOrder: "asc" | "desc";
}) {
  if (field !== sortBy)
    return <ArrowUpDown className="ml-1 inline h-3 w-3 opacity-30" />;
  return sortOrder === "desc" ? (
    <ArrowDown className="ml-1 inline h-3 w-3" />
  ) : (
    <ArrowUp className="ml-1 inline h-3 w-3" />
  );
}

export function LeaderboardTable({
  ideas,
  sortBy,
  sortOrder,
  onSort,
  onSelect,
}: LeaderboardTableProps) {
  const scoreFields: SortField[] = [
    "feasibility",
    "commerciality",
    "novelty",
    "threadsAttraction",
    "taiwanMarketFit",
  ];

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 text-center">#</TableHead>
            <TableHead className="min-w-[200px]">標題</TableHead>
            <TableHead
              className="cursor-pointer whitespace-nowrap text-center"
              onClick={() => onSort("total")}
            >
              總分
              <SortIcon field="total" sortBy={sortBy} sortOrder={sortOrder} />
            </TableHead>
            {scoreFields.map((field) => (
              <TableHead
                key={field}
                className="hidden cursor-pointer whitespace-nowrap text-center lg:table-cell"
                onClick={() => onSort(field)}
              >
                {SCORE_LABELS[field]?.replace("吸引力", "")}
                <SortIcon field={field} sortBy={sortBy} sortOrder={sortOrder} />
              </TableHead>
            ))}
            <TableHead
              className="cursor-pointer whitespace-nowrap text-center"
              onClick={() => onSort("upvotes")}
            >
              按讚數
              <SortIcon
                field="upvotes"
                sortBy={sortBy}
                sortOrder={sortOrder}
              />
            </TableHead>
            <TableHead className="hidden whitespace-nowrap md:table-cell">
              來源
            </TableHead>
            <TableHead className="hidden whitespace-nowrap xl:table-cell">
              標籤
            </TableHead>
            <TableHead
              className="hidden cursor-pointer whitespace-nowrap md:table-cell"
              onClick={() => onSort("date")}
            >
              日期
              <SortIcon field="date" sortBy={sortBy} sortOrder={sortOrder} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ideas.map((idea, index) => (
            <TableRow
              key={idea.id}
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => onSelect(idea)}
            >
              <TableCell className="text-center font-mono text-muted-foreground">
                {index + 1}
              </TableCell>
              <TableCell>
                <IdeaHoverPreview idea={idea} side="bottom">
                  <div className="flex flex-col gap-0.5">
                    <span className="line-clamp-1 text-[15px] font-medium">
                      {idea.titleZh || idea.title}
                    </span>
                    <span className="line-clamp-1 text-sm text-muted-foreground">
                      {extractFirstSentence(idea.summary)}
                    </span>
                    <span className="line-clamp-1 text-sm text-muted-foreground md:hidden">
                      {idea.source === "x" ? "𝕏" : idea.source === "facebook" ? "Facebook" : "Reddit"}
                    </span>
                  </div>
                </IdeaHoverPreview>
              </TableCell>
              <TableCell className="text-center">
                <ScoreBadge score={idea.scores.total} size="md" />
              </TableCell>
              {scoreFields.map((field) => (
                <TableCell
                  key={field}
                  className="hidden text-center lg:table-cell"
                >
                  <ScoreBadge
                    score={
                      idea.scores[field as keyof typeof idea.scores] as number
                    }
                  />
                </TableCell>
              ))}
              <TableCell className="text-center font-mono">
                {idea.upvotes}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <SourceBadge source={idea.source} />
              </TableCell>
              <TableCell className="hidden xl:table-cell">
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
              </TableCell>
              <TableCell className="hidden whitespace-nowrap font-mono text-muted-foreground md:table-cell">
                {idea.date ? format(new Date(idea.date), "MM/dd") : "-"}
              </TableCell>
            </TableRow>
          ))}
          {ideas.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="py-12 text-center">
                <p className="text-muted-foreground">沒有找到符合條件的點子</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
