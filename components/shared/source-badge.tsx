"use client";

import { Badge } from "@/components/ui/badge";
import type { DataSource } from "@/lib/types";

interface SourceBadgeProps {
  source: DataSource;
  size?: "sm" | "md";
}

export function SourceBadge({ source, size = "sm" }: SourceBadgeProps) {
  if (source === "x") {
    return (
      <Badge
        variant="outline"
        className={
          size === "md"
            ? "border-sky-500/30 bg-sky-500/10 text-sm text-sky-400"
            : "border-sky-500/30 bg-sky-500/10 text-xs text-sky-400"
        }
      >
        <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </Badge>
    );
  }

  if (source === "facebook") {
    return (
      <Badge
        variant="outline"
        className={
          size === "md"
            ? "border-blue-500/30 bg-blue-500/10 text-sm text-blue-400"
            : "border-blue-500/30 bg-blue-500/10 text-xs text-blue-400"
        }
      >
        <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        Facebook
      </Badge>
    );
  }

  // Reddit (default for source === "reddit")
  return (
    <Badge
      variant="outline"
      className={
        size === "md"
          ? "border-orange-500/30 bg-orange-500/10 text-sm text-orange-400"
          : "border-orange-500/30 bg-orange-500/10 text-xs text-orange-400"
      }
    >
      <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539-1.076.332-1.874 1.145-2.412 2.088C12.671 8.672 13.38 9.5 14.5 9.5c1.654 0 3 1.346 3 3 0 .582-.166 1.125-.453 1.583 1.364.855 2.453 1.647 2.453 2.917 0 2.209-3.581 4-8 4s-8-1.791-8-4c0-1.27 1.089-2.062 2.453-2.917A2.985 2.985 0 015.5 12.5c0-1.654 1.346-3 3-3 1.12 0 1.829-.828 2.471-1.753-.538-.943-1.336-1.756-2.412-2.088-.208.882-1.001 1.539-1.947 1.539-1.104 0-1.999-.895-1.999-2 0-1.104.895-1.999 1.999-1.999.946 0 1.738.656 1.946 1.538 1.612.497 2.725 1.761 3.442 3.09.717-1.329 1.83-2.593 3.442-3.09.208-.882 1-1.538 1.946-1.538z" />
      </svg>
      Reddit
    </Badge>
  );
}
