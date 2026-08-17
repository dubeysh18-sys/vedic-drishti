import { CrisisResource } from "@/types/reflection";
import { ShieldAlert, Phone, ExternalLink, Heart } from "lucide-react";

interface SafetyBannerProps {
  acknowledgment: string;
  resources: CrisisResource[];
  disclaimer: string;
}

export default function SafetyBanner({ acknowledgment, resources, disclaimer }: SafetyBannerProps) {
  return (
    <div className="w-full max-w-3xl mx-auto my-8 bg-amber-50/90 border border-amber-300 rounded-2xl p-6 md:p-8 shadow-modern flex flex-col gap-6 animate-slide-up">
      <div className="flex items-start gap-4">
        <span className="w-10 h-10 rounded-full bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
          <Heart className="w-5 h-5 text-amber-800" />
        </span>
        <div>
          <h3 className="font-serif font-bold text-xl text-amber-950 mb-2">We Care About You</h3>
          <p className="font-sans text-base text-amber-900 leading-relaxed">{acknowledgment}</p>
        </div>
      </div>

      {/* Emergency Resources */}
      {resources.length > 0 && (
        <div className="flex flex-col gap-3 pt-2">
          <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-700" /> Immediate Support Helplines:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {resources.map((res, i) => (
              <div
                key={i}
                className="bg-white/80 border border-amber-200 rounded-xl p-4 flex flex-col justify-between gap-2 shadow-xs"
              >
                <div>
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide block">
                    {res.country}
                  </span>
                  <span className="font-semibold text-sm text-primary block">{res.resourceName}</span>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-amber-100">
                  {res.phone && (
                    <a
                      href={`tel:${res.phone.replace(/[^0-9+]/g, "")}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline bg-emerald-50 px-2.5 py-1 rounded-md"
                    >
                      <Phone className="w-3 h-3" /> {res.phone}
                    </a>
                  )}
                  {res.website && (
                    <a
                      href={res.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-amber-900 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" /> Website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-xs text-amber-800/80 font-sans border-t border-amber-200/80 pt-4 leading-relaxed">
        {disclaimer}
      </div>
    </div>
  );
}
