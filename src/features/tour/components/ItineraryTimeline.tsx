"use client";

import { useTranslations } from "next-intl";
import { Clock } from "@/components/icons/solar";

interface ItineraryItem {
  time: string;
  activity: string;
}

interface ItineraryTimelineProps {
  itinerary: ItineraryItem[];
}

export default function ItineraryTimeline({ itinerary }: ItineraryTimelineProps) {
  const td = useTranslations("tour.detail");

  if (!itinerary || itinerary.length === 0) return null;

  return (
    <section className="reveal-up space-y-8" style={{ animationDelay: "350ms" }}>
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-primary rounded-full" />
        <h2 className="text-2xl font-black text-on-surface tracking-tight">
          {td("itinerary")}
        </h2>
      </div>

      <div className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-linear-to-b before:from-primary/50 before:via-border before:to-transparent">
        {itinerary.map((item, idx) => (
          <div key={`${item.time}-${idx}`} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-8 top-1.5 w-6 h-6 rounded-full border-2 border-primary bg-background z-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-primary uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5" />
                {item.time}
              </div>
              <div className="glass-surface p-5 rounded-xl border-border/50 group-hover:border-primary/30 transition-colors">
                <p className="text-on-surface-subtle leading-relaxed text-sm md:text-base">
                  {item.activity}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
