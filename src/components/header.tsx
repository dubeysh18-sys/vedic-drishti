"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Bookmark, Info, BookOpen, Menu } from "lucide-react";
import SidebarDrawer from "./sidebar-drawer";
import AudioToggle from "./audio-toggle";
import { ReflectionMessageResponse } from "@/types/reflection";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleStartNew = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (pathname !== "/") {
      router.push("/");
    }
    // Notify page to reset reflection state to a fresh canvas
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("drishti:new-reflection"));
    }
  };

  const handleSelectHistoryItem = (reflection: ReflectionMessageResponse) => {
    if (pathname !== "/") {
      router.push("/");
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("drishti:load-reflection", { detail: reflection }));
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 glass-nav px-4 md:px-8 py-3.5 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3">
          {/* Left Drawer Toggle (Available on all devices) */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 -ml-1 text-primary hover:bg-white/40 active:scale-95 transition-all rounded-full flex items-center justify-center"
            aria-label="Open navigation drawer"
            title="Open Menu & History"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo - Starts fresh page */}
          <Link
            href="/"
            onClick={handleStartNew}
            className="flex items-center gap-2.5 group cursor-pointer"
            title="Drishti Home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Drishti Logo"
              className="w-9 h-9 rounded-full object-cover border border-gold/40 group-hover:scale-105 transition-transform shadow-xs"
            />
            <span className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-primary">
              Drishti
            </span>
          </Link>
        </div>

        {/* Center Positioning Statement (Bold & Italic as per US 3) */}
        <div className="hidden md:flex items-center text-center px-2">
          <span className="text-xs lg:text-sm font-serif italic font-bold text-primary/85 tracking-wide select-none pointer-events-none whitespace-nowrap">
            Find perspective. Draw from timeless wisdom.
          </span>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <AudioToggle />
          <Link
            href="/about"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.scrollTo({ top: 0, left: 0, behavior: "instant" });
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold tracking-wider uppercase font-sans text-primary bg-surface-container border border-outline-variant/40 hover:bg-white hover:border-gold/40 active:scale-95 transition-all shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gold"
            aria-label="How Drishti Works"
          >
            <BookOpen className="w-3.5 h-3.5 text-gold-muted shrink-0" />
            <span className="hidden sm:inline">How Drishti Works</span>
            <span className="sm:hidden">About</span>
          </Link>
        </div>
      </header>

      {/* Sidebar Drawer */}
      <SidebarDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNewReflection={handleStartNew}
        onSelectHistoryItem={handleSelectHistoryItem}
      />
    </>
  );
}
