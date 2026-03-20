"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SOURCE_CONFIG } from "@/lib/constants";
import type { DataSource } from "@/lib/types";

export function Header() {
  const { theme, setTheme } = useTheme();

  const sources = Object.entries(SOURCE_CONFIG) as [
    DataSource,
    (typeof SOURCE_CONFIG)[DataSource],
  ][];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Radar className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold">商業點子雷達</h1>
        </div>

        <div className="flex items-center gap-1">
          {sources.map(([key, config]) => (
            <Button
              key={key}
              variant={config.enabled ? "secondary" : "ghost"}
              size="sm"
              disabled={!config.enabled}
              className="relative text-sm"
            >
              <span className={config.enabled ? config.color : "opacity-40"}>
                {config.label}
              </span>
              {!config.enabled && (
                <Badge
                  variant="outline"
                  className="absolute -right-1 -top-1 px-1 py-0 text-[8px]"
                >
                  Soon
                </Badge>
              )}
            </Button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
