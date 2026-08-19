"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  History,
  ChevronDown,
  ChevronRight,
  Trash2,
  Bookmark,
  Info,
  X,
  MessageSquare,
  Clock,
  Plus,
} from "lucide-react";
import {
  getChatHistory,
  deleteChatFromHistory,
  clearAllChatHistory,
  groupHistoryByDate,
  HistoryItem,
  DateGroupedHistory,
} from "@/lib/storage/history-store";
import { ReflectionMessageResponse } from "@/types/reflection";

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNewReflection: () => void;
  onSelectHistoryItem: (reflection: ReflectionMessageResponse) => void;
}

export default function SidebarDrawer({
  isOpen,
  onClose,
  onNewReflection,
  onSelectHistoryItem,
}: SidebarDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [historyGroups, setHistoryGroups] = useState<DateGroupedHistory[]>([]);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

  const loadHistory = () => {
    const items = getChatHistory();
    setHistoryGroups(groupHistoryByDate(items));
  };

  useEffect(() => {
    loadHistory();

    const handleHistoryChange = () => {
      loadHistory();
    };

    window.addEventListener("drishti:history-changed", handleHistoryChange);
    return () => {
      window.removeEventListener("drishti:history-changed", handleHistoryChange);
    };
  }, []);

  const handleStartNew = () => {
    onClose();
    if (pathname !== "/") {
      router.push("/");
    }
    onNewReflection();
  };

  const handleItemClick = (item: HistoryItem) => {
    setActiveHistoryId(item.id);
    onClose();
    if (pathname !== "/") {
      router.push("/");
    }
    onSelectHistoryItem(item.reflectionData);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteChatFromHistory(id);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to clear your reflection history?")) {
      clearAllChatHistory();
    }
  };

  if (!isOpen) return null;

  const totalItemsCount = historyGroups.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative z-10 w-80 max-w-[85vw] h-full bg-[#FCFBF7]/95 backdrop-blur-2xl border-r border-gold/30 shadow-2xl flex flex-col justify-between animate-slide-right font-sans text-primary">
        {/* Top Header */}
        <div className="p-4 border-b border-gold/20 flex items-center justify-between">
          <Link
            href="/"
            onClick={handleStartNew}
            className="flex items-center gap-2.5 group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Drishti"
              className="w-8 h-8 rounded-full object-cover border border-gold/40 group-hover:scale-105 transition-transform"
            />
            <span className="font-serif text-xl font-bold text-primary tracking-tight">
              Drishti
            </span>
          </Link>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-muted-stone hover:text-primary hover:bg-black/5 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button: New Reflection */}
        <div className="p-4 pb-2">
          <button
            onClick={handleStartNew}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#2A261F] to-[#403B32] text-[#F7F4EE] flex items-center justify-center gap-2.5 font-medium text-sm shadow-md hover:shadow-lg active:scale-[0.98] transition-all group"
          >
            <Plus className="w-4 h-4 text-gold-light group-hover:rotate-90 transition-transform duration-300" />
            <span>New Reflection</span>
          </button>
        </div>

        {/* Scrollable Content (History Section) */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 custom-scrollbar">
          {/* History Collapsible Group */}
          <div>
            <div
              onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
              className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-stone uppercase tracking-wider cursor-pointer hover:text-primary transition-colors select-none rounded-lg hover:bg-black/5"
            >
              <div className="flex items-center gap-2">
                <History className="w-3.5 h-3.5 text-gold-muted" />
                <span>History</span>
                {totalItemsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-gold/15 text-primary text-[10px]">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              {isHistoryExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-muted-stone" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-muted-stone" />
              )}
            </div>

            {isHistoryExpanded && (
              <div className="mt-1 space-y-3">
                {historyGroups.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-muted-stone/80 flex flex-col items-center gap-2">
                    <Clock className="w-6 h-6 text-gold-muted/40" />
                    <span>No previous reflections yet.</span>
                    <span className="text-[11px] text-muted-stone/60">Your questions & perspectives will be saved here.</span>
                  </div>
                ) : (
                  historyGroups.map((group) => (
                    <div key={group.dateLabel} className="space-y-1">
                      {/* Date Partition Header */}
                      <div className="px-3 pt-2 pb-1 text-[11px] font-medium text-muted-stone/70 border-b border-gold/10">
                        {group.dateLabel}
                      </div>

                      {/* Items */}
                      <div className="space-y-0.5">
                        {group.items.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                              activeHistoryId === item.id
                                ? "bg-white border border-gold/30 shadow-xs font-medium text-primary"
                                : "text-primary/90 hover:bg-white/80 hover:shadow-xs"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <MessageSquare className="w-3.5 h-3.5 text-gold-muted shrink-0 opacity-70 group-hover:opacity-100" />
                              <span className="truncate leading-tight">{item.title}</span>
                            </div>

                            <button
                              onClick={(e) => handleDeleteItem(item.id, e)}
                              title="Delete reflection"
                              className="opacity-0 group-hover:opacity-100 p-1 text-muted-stone hover:text-error hover:bg-error/10 rounded-md transition-all shrink-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}

                {totalItemsCount > 0 && (
                  <div className="pt-2 px-3 text-center">
                    <button
                      onClick={handleClearAll}
                      className="text-[11px] text-muted-stone hover:text-error transition-colors underline decoration-dotted"
                    >
                      Clear all history
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation Links */}
        <div className="p-3 border-t border-gold/20 space-y-1 bg-surface-container/30">
          <Link
            href="/archive"
            onClick={onClose}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
              pathname === "/archive"
                ? "bg-white text-primary shadow-xs font-semibold"
                : "text-muted-stone hover:text-primary hover:bg-white/60"
            }`}
          >
            <Bookmark className="w-4 h-4 text-gold-muted" />
            <span>Saved Reflections</span>
          </Link>

          <Link
            href="/about"
            onClick={onClose}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
              pathname === "/about"
                ? "bg-white text-primary shadow-xs font-semibold"
                : "text-muted-stone hover:text-primary hover:bg-white/60"
            }`}
          >
            <Info className="w-4 h-4 text-gold-muted" />
            <span>How Drishti Works</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
