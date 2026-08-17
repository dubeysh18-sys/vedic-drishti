import Link from "next/link";
import { Sparkles, Shield, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container/60 border-t border-outline-variant/30 py-8 px-6 md:px-12 mt-auto z-10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-serif font-bold text-lg text-primary">Drishti</span>
            <span className="text-muted-stone text-xs">•</span>
            <span className="text-xs text-muted-stone font-sans tracking-wide">Modern Reflection Companion</span>
          </div>
          <p className="text-xs text-muted-stone max-w-md">
            Grounded in the Bhagavad Gita. Providing philosophical perspectives, not medical or psychological advice.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-muted-stone font-sans">
          <Link href="/about" className="hover:text-primary transition-colors flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-gold-muted" />
            4-Layer Trust
          </Link>
          <Link href="/archive" className="hover:text-primary transition-colors flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-gold-muted" />
            Archive
          </Link>
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-stone/80">
            Made with <Heart className="w-3 h-3 text-gold inline" /> for clarity
          </span>
        </div>
      </div>
    </footer>
  );
}
