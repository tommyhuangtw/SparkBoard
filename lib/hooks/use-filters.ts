"use client";

import { useState, useMemo, useCallback } from "react";
import type { BusinessIdea, FilterState, SortField } from "@/lib/types";

const DEFAULT_FILTERS: FilterState = {
  search: "",
  sortBy: "total",
  sortOrder: "desc",
  tags: [],
  dateRange: { from: null, to: null },
  minScore: null,
  source: "all",
};

export function useFilters(ideas: BusinessIdea[]) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const filteredIdeas = useMemo(() => {
    let result = [...ideas];

    // Search filter
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (idea) =>
          idea.title.toLowerCase().includes(q) ||
          idea.titleZh.toLowerCase().includes(q) ||
          idea.summary.toLowerCase().includes(q) ||
          idea.businessAnalysis.toLowerCase().includes(q) ||
          idea.subreddit.toLowerCase().includes(q) ||
          idea.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Tag filter (OR logic)
    if (filters.tags.length > 0) {
      result = result.filter((idea) =>
        idea.tags.some((tag) => filters.tags.includes(tag))
      );
    }

    // Date range filter
    if (filters.dateRange.from) {
      const from = filters.dateRange.from.getTime();
      result = result.filter((idea) => new Date(idea.date).getTime() >= from);
    }
    if (filters.dateRange.to) {
      const to = filters.dateRange.to.getTime() + 86400000; // include end date
      result = result.filter((idea) => new Date(idea.date).getTime() < to);
    }

    // Source filter
    if (filters.source !== "all") {
      result = result.filter((idea) => idea.source === filters.source);
    }

    // Min score filter
    if (filters.minScore !== null) {
      result = result.filter(
        (idea) => idea.scores.total >= filters.minScore!
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      if (filters.sortBy === "date") {
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
      } else if (
        filters.sortBy === "upvotes" ||
        filters.sortBy === "commentCount"
      ) {
        aVal = a[filters.sortBy];
        bVal = b[filters.sortBy];
      } else {
        aVal = a.scores[filters.sortBy as keyof typeof a.scores];
        bVal = b.scores[filters.sortBy as keyof typeof b.scores];
      }

      return filters.sortOrder === "desc"
        ? (bVal as number) - (aVal as number)
        : (aVal as number) - (bVal as number);
    });

    return result;
  }, [ideas, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.source !== "all") count++;
    if (filters.tags.length > 0) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.minScore !== null) count++;
    return count;
  }, [filters]);

  return {
    filters,
    filteredIdeas,
    updateFilter,
    resetFilters,
    activeFilterCount,
    setSortBy: (sortBy: SortField) => {
      setFilters((prev) => ({
        ...prev,
        sortBy,
        sortOrder:
          prev.sortBy === sortBy
            ? prev.sortOrder === "desc"
              ? "asc"
              : "desc"
            : "desc",
      }));
    },
  };
}
