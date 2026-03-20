"use client";

import { useState } from "react";
import { Filter, LayoutGrid, TableProperties } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";
import { StatsBar } from "@/components/layout/stats-bar";
import { SidebarFilters } from "@/components/layout/sidebar-filters";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { IdeaCard } from "@/components/cards/idea-card";
import { IdeaDetailDialog } from "@/components/cards/idea-detail-dialog";
import { IdeaRadarChart } from "@/components/charts/radar-chart";
import { TrendLineChart } from "@/components/charts/trend-line-chart";
import { TagBarChart } from "@/components/charts/tag-bar-chart";
import { ScoreHistogram } from "@/components/charts/score-histogram";
import { DailySummary } from "@/components/summary/daily-summary";
import { WeeklySummary } from "@/components/summary/weekly-summary";
import { useIdeas } from "@/lib/hooks/use-ideas";
import { useFilters } from "@/lib/hooks/use-filters";
import type { BusinessIdea } from "@/lib/types";

export default function DashboardPage() {
  const { ideas, meta, isLoading, isError } = useIdeas();
  const {
    filters,
    filteredIdeas,
    updateFilter,
    resetFilters,
    activeFilterCount,
    setSortBy,
  } = useFilters(ideas);

  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  const handleSelectIdea = (idea: BusinessIdea) => {
    setSelectedIdea(idea);
    setDetailOpen(true);
  };

  const filterPanel = (
    <SidebarFilters
      filters={filters}
      updateFilter={updateFilter}
      resetFilters={resetFilters}
      activeFilterCount={activeFilterCount}
    />
  );

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
          <div className="mt-6 space-y-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto flex max-w-7xl items-center justify-center px-4 py-20">
          <div className="text-center">
            <p className="text-lg font-semibold">無法載入資料</p>
            <p className="mt-1 text-sm text-muted-foreground">
              請確認 Google Sheets API Key 已正確設定
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6">
        <StatsBar ideas={ideas} />

        <div className="mt-6 flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">{filterPanel}</aside>

          {/* Main Content */}
          <div className="min-w-0 flex-1">
            <Tabs defaultValue="leaderboard">
              <div className="mb-4 flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="leaderboard">排行榜</TabsTrigger>
                  <TabsTrigger value="charts">圖表</TabsTrigger>
                  <TabsTrigger value="summary">摘要</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  {/* Mobile filter button */}
                  <Sheet>
                    <SheetTrigger
                      render={
                        <Button
                          variant="outline"
                          size="sm"
                          className="lg:hidden"
                        />
                      }
                    >
                      <Filter className="mr-1 h-3.5 w-3.5" />
                      篩選
                      {activeFilterCount > 0 && (
                        <Badge className="ml-1 h-4 w-4 rounded-full p-0 text-[10px]">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 pt-10">
                      {filterPanel}
                    </SheetContent>
                  </Sheet>

                  {/* View toggle */}
                  <div className="hidden items-center gap-1 sm:flex">
                    <Button
                      variant={viewMode === "table" ? "secondary" : "ghost"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode("table")}
                    >
                      <TableProperties className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant={viewMode === "cards" ? "secondary" : "ghost"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode("cards")}
                    >
                      <LayoutGrid className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <span className="text-sm text-muted-foreground">
                    {filteredIdeas.length} 個結果
                  </span>
                </div>
              </div>

              {/* Leaderboard Tab */}
              <TabsContent value="leaderboard">
                {viewMode === "table" ? (
                  <LeaderboardTable
                    ideas={filteredIdeas}
                    sortBy={filters.sortBy}
                    sortOrder={filters.sortOrder}
                    onSort={setSortBy}
                    onSelect={handleSelectIdea}
                  />
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {filteredIdeas.map((idea, i) => (
                      <IdeaCard
                        key={idea.id}
                        idea={idea}
                        rank={i + 1}
                        onClick={() => handleSelectIdea(idea)}
                      />
                    ))}
                    {filteredIdeas.length === 0 && (
                      <div className="col-span-full py-12 text-center">
                        <p className="text-muted-foreground">
                          沒有找到符合條件的點子
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* Charts Tab */}
              <TabsContent value="charts">
                <div className="grid gap-4 md:grid-cols-2">
                  <IdeaRadarChart idea={filteredIdeas[0] || null} />
                  <TrendLineChart ideas={filteredIdeas} />
                  <TagBarChart ideas={filteredIdeas} />
                  <ScoreHistogram ideas={filteredIdeas} />
                </div>
              </TabsContent>

              {/* Summary Tab */}
              <TabsContent value="summary">
                <div className="grid gap-6 lg:grid-cols-2">
                  <DailySummary ideas={ideas} onSelect={handleSelectIdea} />
                  <WeeklySummary ideas={ideas} onSelect={handleSelectIdea} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <IdeaDetailDialog
        idea={selectedIdea}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
