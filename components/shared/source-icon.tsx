import type { DataSource } from "@/lib/types";
import { cn } from "@/lib/utils";

const icons: Record<DataSource, string> = {
  reddit: "⬡",
  x: "𝕏",
  facebook: "f",
  threads: "@",
};

const colors: Record<DataSource, string> = {
  reddit: "text-orange-500",
  x: "text-foreground",
  facebook: "text-blue-500",
  threads: "text-foreground",
};

export function SourceIcon({
  source,
  className,
}: {
  source: DataSource;
  className?: string;
}) {
  return (
    <span className={cn("font-bold", colors[source], className)}>
      {icons[source]}
    </span>
  );
}
