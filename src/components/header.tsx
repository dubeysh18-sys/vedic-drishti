"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Bookmark, Info, BookOpen, Menu } from "lucide-react";
import SidebarDrawer from "./sidebar-drawer";
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            onClick={handleStartNew}
            className={`font-sans text-sm font-medium transition-colors ${
              pathname === "/" ? "text-primary font-semibold" : "text-muted-stone hover:text-primary"
            }`}
          >
            Reflect
          </Link>
          <Link
            href="/archive"
            className={`flex items-center gap-1.5 font-sans text-sm font-medium transition-colors ${
              pathname === "/archive" ? "text-primary font-semibold" : "text-muted-stone hover:text-primary"
            }`}
          >
            <Bookmark className="w-4 h-4 text-gold-muted" />
            Archive
          </Link>
          <Link
            href="/about"
            className={`flex items-center gap-1.5 font-sans text-sm font-medium transition-colors ${
              pathname === "/about" ? "text-primary font-semibold" : "text-muted-stone hover:text-primary"
            }`}
          >
            <Info className="w-4 h-4 text-muted-stone" />
            About & Trust
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-2">
          <Link
            href="/archive"
            className="p-2 text-primary hover:bg-white/40 rounded-full transition-colors flex items-center justify-center md:hidden"
            title="View Archive"
          >
            <Bookmark className="w-5 h-5 text-gold-muted" />
          </Link>
          <Link
            href="/about"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase font-sans text-primary bg-surface-container border border-outline-variant/40 hover:bg-white transition-all shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-gold-muted" />
            Vedic Wisdom
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
