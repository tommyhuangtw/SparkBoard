import { cn } from "@/lib/utils";
import { getScoreBg } from "@/lib/constants";

interface ScoreBadgeProps {
  score: number;
  label?: string;
  size?: "sm" | "md";
}

export function ScoreBadge({ score, label, size = "sm" }: ScoreBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border font-mono font-semibold",
        getScoreBg(score),
        size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-2 py-1 text-sm"
      )}
    >
      {label && (
        <span className="font-sans font-normal opacity-70">{label}</span>
      )}
      {score}
    </span>
  );
}
