import { makeDemoHistory } from "@/lib/studio-data";
import type { HistoryItem } from "@/types/studio";

const HISTORY_KEY = "framepilot.history.v1";

export function readHistory(): HistoryItem[] {
  try {
    const value = window.localStorage.getItem(HISTORY_KEY);
    if (!value) {
      const demos = makeDemoHistory();
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(demos));
      return demos;
    }
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      const demos = makeDemoHistory();
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(demos));
      return demos;
    }
    return parsed.filter((item): item is HistoryItem => {
      return Boolean(item && typeof item === "object" && "id" in item && "prompt" in item && "createdAt" in item);
    });
  } catch {
    return makeDemoHistory();
  }
}

export function writeHistory(history: HistoryItem[]) {
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 24)));
    return true;
  } catch {
    return false;
  }
}
