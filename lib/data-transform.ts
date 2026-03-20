import type { BusinessIdea, DataSource } from "./types";
import { TAG_LIST } from "./constants";

export function transformRows(rows: string[][]): BusinessIdea[] {
  return rows
    .map((row, index) => transformRow(row, index))
    .filter((idea): idea is BusinessIdea => idea !== null);
}

function detectSource(originalUrl: string, sourceCol: string | undefined): DataSource {
  if (sourceCol) {
    const s = sourceCol.trim().toLowerCase();
    if (s === "x" || s === "twitter" || s === "x（推特）" || s === "推特") return "x";
    if (s === "facebook" || s === "fb" || s === "臉書") return "facebook";
    if (s === "reddit") return "reddit";
  }
  // Fallback: detect from URL
  if (originalUrl.includes("twitter.com") || originalUrl.includes("x.com")) return "x";
  if (originalUrl.includes("facebook.com") || originalUrl.includes("fb.com") || originalUrl.includes("fb.watch")) return "facebook";
  return "reddit";
}

function transformRow(row: string[], index: number): BusinessIdea | null {
  // X data may not have title (col 1), so check date + (title or titleZh)
  if (!row[0] || (!row[1] && !row[2])) return null;

  const parseNum = (val: string | undefined) => {
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  };

  const parseTags = (val: string | undefined): string[] => {
    if (!val) return [];
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        return parsed
          .map((t: unknown) => String(t).trim())
          .filter((t) => TAG_LIST.includes(t as (typeof TAG_LIST)[number]));
      }
    } catch {
      // fallback: comma-separated
      return val
        .split(",")
        .map((t) => t.trim())
        .filter((t) => TAG_LIST.includes(t as (typeof TAG_LIST)[number]));
    }
    return [];
  };

  // Normalize date: handle both ISO and "M/D/YYYY, H:MM:SS AM/PM" formats
  const rawDate = row[0] || "";
  let normalizedDate = rawDate;
  if (rawDate && !rawDate.includes("T")) {
    const parsed = new Date(rawDate);
    if (!isNaN(parsed.getTime())) {
      normalizedDate = parsed.toISOString();
    }
  }

  const originalUrl = row[14] || "";

  // Sheet columns: A=日期, B=標題, C=中文標題, D=留言數, E=按讚數,
  // F=可行性, G=商業性, H=新穎性, I=社群吸引力, J=台灣市場適用性,
  // K=總分, L=重點整理, M=商業機會分析, N=Threads切入角度,
  // O=原始URL, P=Reddit連結, Q=X連結, R=FB連結,
  // S=Subreddit, T=類別
  return {
    id: `idea-${index}`,
    date: normalizedDate,
    title: row[1] || "",
    titleZh: row[2] || "",
    source: detectSource(originalUrl, row[20]),
    commentCount: parseNum(row[3]),
    upvotes: parseNum(row[4]),
    scores: {
      feasibility: parseNum(row[5]),
      commerciality: parseNum(row[6]),
      novelty: parseNum(row[7]),
      threadsAttraction: parseNum(row[8]),
      taiwanMarketFit: parseNum(row[9]),
      total: parseNum(row[10]),
    },
    summary: row[11] || "",
    businessAnalysis: row[12] || "",
    threadsAngle: row[13] || "",
    originalUrl,
    redditUrl: row[15] || "",
    xUrl: row[16] || "",
    fbUrl: row[17] || "",
    subreddit: row[18] || "",
    tags: parseTags(row[19]),
  };
}
