"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bookmark, Info, Sparkles, BookOpen, Menu, X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 glass-nav px-4 md:px-8 py-3.5 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-1 text-primary hover:bg-white/40 transition-colors rounded-full flex items-center justify-center md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-full bg-secondary-container/60 border border-gold/40 flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-gold-muted" />
            </span>
            <span className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-primary">
              Drishti
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
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

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[57px] bg-background/95 backdrop-blur-xl z-30 flex flex-col p-6 gap-6 md:hidden animate-slide-up border-b border-gold/20">
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/70 text-primary font-medium text-lg"
            >
              <Sparkles className="w-5 h-5 text-gold-muted" />
              New Reflection
            </Link>
            <Link
              href="/archive"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/70 text-primary font-medium text-lg"
            >
              <Bookmark className="w-5 h-5 text-gold-muted" />
              Saved Reflections
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/70 text-primary font-medium text-lg"
            >
              <Info className="w-5 h-5 text-gold-muted" />
              About & Trust Model
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
