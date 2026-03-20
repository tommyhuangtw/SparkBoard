import type { SortField } from "./types";

export const SPREADSHEET_ID = "1tZIiwOlczlULZVIkqnAhLjs87zQrXdvFRAu75ssaj_I";
export const SHEET_RANGE = "A:U";

export const COLUMN_MAP = {
  0: "date",
  1: "title",
  2: "titleZh",
  3: "commentCount",
  4: "upvotes",
  5: "feasibility",
  6: "commerciality",
  7: "novelty",
  8: "threadsAttraction",
  9: "taiwanMarketFit",
  10: "total",
  11: "summary",
  12: "businessAnalysis",
  13: "threadsAngle",
  14: "originalUrl",
  15: "redditUrl",
  16: "xUrl",
  17: "fbUrl",
  18: "subreddit",
  19: "tags",
  20: "source",
} as const;

export const SCORE_LABELS: Record<string, string> = {
  feasibility: "可行性",
  commerciality: "商業性",
  novelty: "新穎性",
  threadsAttraction: "社群吸引力",
  taiwanMarketFit: "台灣市場適用性",
  total: "總分",
};

export const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "total", label: "總分" },
  { value: "feasibility", label: "可行性" },
  { value: "commerciality", label: "商業性" },
  { value: "novelty", label: "新穎性" },
  { value: "threadsAttraction", label: "社群吸引力" },
  { value: "taiwanMarketFit", label: "台灣市場適用性" },
  { value: "upvotes", label: "按讚數" },
  { value: "commentCount", label: "留言數" },
  { value: "date", label: "日期" },
];

// Normalize score to 10-point scale for color thresholds
function normalize(score: number): number {
  return score > 10 ? score / 10 : score;
}

export function getScoreColor(score: number): string {
  const s = normalize(score);
  if (s >= 9) return "text-emerald-500";
  if (s >= 7) return "text-sky-500";
  if (s >= 5) return "text-amber-500";
  if (s >= 3) return "text-orange-500";
  return "text-rose-500";
}

export function getScoreBg(score: number): string {
  const s = normalize(score);
  if (s >= 9) return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
  if (s >= 7) return "bg-sky-500/10 text-sky-500 border-sky-500/20";
  if (s >= 5) return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  if (s >= 3) return "bg-orange-500/10 text-orange-500 border-orange-500/20";
  return "bg-rose-500/10 text-rose-500 border-rose-500/20";
}

export const TAG_LIST = [
  "SaaS工具",
  "行銷自動化",
  "開發者工具",
  "教育知識",
  "電商零售",
  "求職招聘",
  "內容創作",
  "客服溝通",
  "數據分析",
  "諮詢服務",
] as const;

export const TAG_COLORS: Record<string, string> = {
  "SaaS工具": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "行銷自動化": "bg-purple-500/10 text-purple-600 border-purple-500/20",
  "開發者工具": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "教育知識": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "電商零售": "bg-rose-500/10 text-rose-600 border-rose-500/20",
  "求職招聘": "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  "內容創作": "bg-pink-500/10 text-pink-600 border-pink-500/20",
  "客服溝通": "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  "數據分析": "bg-teal-500/10 text-teal-600 border-teal-500/20",
  "諮詢服務": "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

export function getTagColor(tag: string): string {
  return TAG_COLORS[tag] || "bg-muted text-muted-foreground border-border";
}

export const SOURCE_CONFIG = {
  reddit: { label: "Reddit", color: "text-orange-500", enabled: true },
  x: { label: "X", color: "text-foreground", enabled: true },
  facebook: { label: "Facebook", color: "text-blue-500", enabled: true },
  threads: { label: "Threads", color: "text-foreground", enabled: false },
} as const;
