"use client";

import { useLocale, useTranslations } from "next-intl";
import { Clock } from "@/components/icons/solar";

// Accept any of the possible shapes
interface ItineraryObjectItem {
  time?: string;
  activity?: string;
  task?: string;
  day?: number | string;
  title?: string;
  content?: string;
}

type ItineraryItem = string | ItineraryObjectItem;

interface ItineraryTimelineProps {
  itinerary: ItineraryItem[];
}

export default function ItineraryTimeline({ itinerary }: ItineraryTimelineProps) {
  const td = useTranslations("tour.detail");
  const locale = useLocale();

  if (!itinerary || itinerary.length === 0) return null;

  return (
    <section className="reveal-up space-y-8" style={{ animationDelay: "350ms" }}>
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-primary rounded-full" />
        <h2 className="text-2xl font-black text-on-surface tracking-tight">
          {td("itinerary")}
        </h2>
      </div>

      <div className="relative pl-8 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-linear-to-b before:from-primary/50 before:via-border before:to-transparent">
        {itinerary.map((item, idx) => {
          let resolvedTime = "";
          let resolvedTitle = "";
          let resolvedContent = "";

          if (typeof item === "string") {
            resolvedTime = locale === "vi" ? `Hoạt động ${idx + 1}` : `Activity ${idx + 1}`;
            resolvedContent = item;
          } else if (item && typeof item === "object") {
            // Determine time / step label
            if (item.time) {
              resolvedTime = item.time;
            } else if (item.day !== undefined && item.day !== null) {
              resolvedTime = locale === "vi" ? `Ngày ${item.day}` : `Day ${item.day}`;
            } else {
              resolvedTime = locale === "vi" ? `Hoạt động ${idx + 1}` : `Activity ${idx + 1}`;
            }

            // Determine title
            resolvedTitle = item.title || "";

            // Determine content
            resolvedContent = item.content || item.activity || item.task || "";
          }

          if (!resolvedContent && !resolvedTitle) return null;

          return (
            <div key={`${resolvedTime}-${idx}`} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-8 top-1.5 w-6 h-6 rounded-full border-2 border-primary bg-background z-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold font-mono text-primary uppercase tracking-widest">
                  <Clock className="w-3.5 h-3.5" />
                  {resolvedTime}
                </div>
                <div className="rounded-[20px] border border-border bg-[#f7f7f7] p-5 transition-colors group-hover:border-primary/30 group-hover:bg-white">
                  {resolvedTitle && (
                    <h3 className="text-base font-bold text-on-surface mb-1">
                      {resolvedTitle}
                    </h3>
                  )}
                  <p className="text-sm leading-relaxed text-on-surface md:text-base">
                    {resolvedContent}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

