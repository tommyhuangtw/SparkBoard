import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractFirstSentence(text: string): string {
  if (!text) return "";
  // Only split on Chinese sentence-ending punctuation to avoid cutting on English periods
  const match = text.match(/^[^。！？]+[。！？]/);
  return match ? match[0] : text.slice(0, 100) + "…";
}
