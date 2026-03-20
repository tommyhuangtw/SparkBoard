"use client";

import { Search, X, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SORT_OPTIONS, TAG_LIST, getTagColor, SOURCE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { FilterState, SortField, DataSource } from "@/lib/types";

interface SidebarFiltersProps {
  filters: FilterState;
  updateFilter: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => void;
  resetFilters: () => void;
  activeFilterCount: number;
}

export function SidebarFilters({
  filters,
  updateFilter,
  resetFilters,
  activeFilterCount,
}: SidebarFiltersProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">篩選條件</h2>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <RotateCcw className="mr-1 h-3 w-3" />
            重置
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">搜尋</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="搜尋標題、摘要..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-8 text-sm"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter("search", "")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">排序依據</Label>
        <Select
          value={filters.sortBy}
          onValueChange={(v) => updateFilter("sortBy", v as SortField)}
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-1">
          <Button
            variant={filters.sortOrder === "desc" ? "secondary" : "ghost"}
            size="sm"
            className="flex-1 text-sm"
            onClick={() => updateFilter("sortOrder", "desc")}
          >
            高到低
          </Button>
          <Button
            variant={filters.sortOrder === "asc" ? "secondary" : "ghost"}
            size="sm"
            className="flex-1 text-sm"
            onClick={() => updateFilter("sortOrder", "asc")}
          >
            低到高
          </Button>
        </div>
      </div>

      <Separator />

      {/* Source */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">來源</Label>
        <div className="flex gap-1">
          {(
            [
              { value: "all", label: "全部" },
              ...Object.entries(SOURCE_CONFIG)
                .filter(([, cfg]) => cfg.enabled)
                .map(([key, cfg]) => ({ value: key, label: cfg.label })),
            ] as { value: DataSource | "all"; label: string }[]
          ).map((opt) => (
            <Button
              key={opt.value}
              variant={filters.source === opt.value ? "secondary" : "ghost"}
              size="sm"
              className="flex-1 text-sm"
              onClick={() => updateFilter("source", opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Min Score */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-muted-foreground">最低總分</Label>
          <span className="font-mono text-sm text-muted-foreground">
            {filters.minScore ?? 0}
          </span>
        </div>
        <Slider
          value={[filters.minScore ?? 0]}
          onValueChange={(val) => {
            const v = Array.isArray(val) ? val[0] : val;
            updateFilter("minScore", v === 0 ? null : v);
          }}
          max={100}
          step={5}
          className="py-2"
        />
      </div>

      <Separator />

      {/* Tags */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">標籤分類</Label>
        <div className="max-h-48 space-y-1.5 overflow-y-auto">
          {TAG_LIST.map((tag) => (
            <label
              key={tag}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-muted"
            >
              <Checkbox
                checked={filters.tags.includes(tag)}
                onCheckedChange={(checked) => {
                  const next = checked
                    ? [...filters.tags, tag]
                    : filters.tags.filter((t) => t !== tag);
                  updateFilter("tags", next);
                }}
              />
              <Badge
                variant="outline"
                className={cn("text-xs", getTagColor(tag))}
              >
                {tag}
              </Badge>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
