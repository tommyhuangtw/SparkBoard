export type DataSource = "reddit" | "x" | "facebook" | "threads";

export interface BusinessIdea {
  id: string;
  date: string;
  title: string;
  titleZh: string;
  source: DataSource;
  scores: {
    feasibility: number;
    commerciality: number;
    novelty: number;
    threadsAttraction: number;
    taiwanMarketFit: number;
    total: number;
  };
  upvotes: number;
  summary: string;
  businessAnalysis: string;
  threadsAngle: string;
  originalUrl: string;
  redditUrl: string;
  xUrl: string;
  fbUrl: string;
  subreddit: string;
  commentCount: number;
  tags: string[];
}

export interface FilterState {
  search: string;
  sortBy: SortField;
  sortOrder: "asc" | "desc";
  tags: string[];
  dateRange: { from: Date | null; to: Date | null };
  minScore: number | null;
  source: DataSource | "all";
}

export type SortField =
  | "total"
  | "feasibility"
  | "commerciality"
  | "novelty"
  | "threadsAttraction"
  | "taiwanMarketFit"
  | "date"
  | "upvotes"
  | "commentCount";

export interface IdeasResponse {
  ideas: BusinessIdea[];
  lastUpdated: string;
  meta: {
    totalCount: number;
    subreddits: string[];
    tags: string[];
    sources: string[];
  };
}
