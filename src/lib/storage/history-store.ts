import { ReflectionMessageResponse } from "@/types/reflection";

export interface HistoryItem {
  id: string;
  title: string;
  timestamp: number; // Date.now()
  selectedEmotion?: string | null;
  reflectionData: ReflectionMessageResponse;
}

export interface DateGroupedHistory {
  dateLabel: string;
  items: HistoryItem[];
}

const STORAGE_KEY = "drishti_chat_history";
const MAX_HISTORY_ITEMS = 100;

export function getChatHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error("Failed to read chat history:", err);
    return [];
  }
}

export function saveChatToHistory(reflectionData: ReflectionMessageResponse): HistoryItem | null {
  if (typeof window === "undefined") return null;
  if (!reflectionData || !reflectionData.userInput) return null;

  try {
    const history = getChatHistory();
    // Prevent duplicate entries for the same reflection ID
    const existingIndex = history.findIndex((h) => h.id === reflectionData.id);

    const title = reflectionData.userInput.trim();
    const item: HistoryItem = {
      id: reflectionData.id || `hist_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title,
      timestamp: Date.now(),
      selectedEmotion: reflectionData.selectedEmotion,
      reflectionData,
    };

    let updatedHistory: HistoryItem[];
    if (existingIndex >= 0) {
      updatedHistory = [
        item,
        ...history.filter((_, idx) => idx !== existingIndex),
      ];
    } else {
      updatedHistory = [item, ...history].slice(0, MAX_HISTORY_ITEMS);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    notifyHistoryChange();
    return item;
  } catch (err) {
    console.error("Failed to save chat to history:", err);
    return null;
  }
}

export function deleteChatFromHistory(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const history = getChatHistory();
    const filtered = history.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    notifyHistoryChange();
  } catch (err) {
    console.error("Failed to delete chat history item:", err);
  }
}

export function clearAllChatHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    notifyHistoryChange();
  } catch (err) {
    console.error("Failed to clear chat history:", err);
  }
}

function notifyHistoryChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("drishti:history-changed"));
  }
}

/**
 * Group history items by standardized date partitions (Today, Yesterday, Previous 7 Days, Older)
 */
export function groupHistoryByDate(items: HistoryItem[]): DateGroupedHistory[] {
  if (!items || items.length === 0) return [];

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 86400000;
  const sevenDaysAgo = today - 7 * 86400000;
  const thirtyDaysAgo = today - 30 * 86400000;

  const groups: { [key: string]: HistoryItem[] } = {
    Today: [],
    Yesterday: [],
    "Previous 7 Days": [],
    "Previous 30 Days": [],
    Older: [],
  };

  for (const item of items) {
    const itemTime = item.timestamp || Date.now();
    if (itemTime >= today) {
      groups["Today"].push(item);
    } else if (itemTime >= yesterday) {
      groups["Yesterday"].push(item);
    } else if (itemTime >= sevenDaysAgo) {
      groups["Previous 7 Days"].push(item);
    } else if (itemTime >= thirtyDaysAgo) {
      groups["Previous 30 Days"].push(item);
    } else {
      groups["Older"].push(item);
    }
  }

  const result: DateGroupedHistory[] = [];
  for (const label of ["Today", "Yesterday", "Previous 7 Days", "Previous 30 Days", "Older"]) {
    if (groups[label] && groups[label].length > 0) {
      result.push({
        dateLabel: label,
        items: groups[label],
      });
    }
  }

  return result;
}
