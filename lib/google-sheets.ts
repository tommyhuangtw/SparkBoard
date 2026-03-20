import type { BusinessIdea } from "./types";
import { transformRows } from "./data-transform";

const SPREADSHEET_ID = "1tZIiwOlczlULZVIkqnAhLjs87zQrXdvFRAu75ssaj_I";
const SHEET_RANGE = "A:U";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

let cache: { data: BusinessIdea[]; timestamp: number } | null = null;

export async function fetchIdeas(): Promise<BusinessIdea[]> {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }

  const apiKey = process.env.TOMMYHUANG0511_GOOGLE_SHEET_API;
  if (!apiKey) {
    throw new Error("TOMMYHUANG0511_GOOGLE_SHEET_API environment variable is not set");
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_RANGE}?key=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 300 } });

  if (!res.ok) {
    throw new Error(`Google Sheets API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const rows: string[][] = data.values || [];

  // Skip header row
  const dataRows = rows.slice(1);
  const ideas = transformRows(dataRows);

  cache = { data: ideas, timestamp: Date.now() };
  return ideas;
}
