"use client";

import { useTranslations } from "next-intl";

interface Props {
  title: string;
  subtitle: string;
  image: string;
  count: number;
}

export default function LandingHero({ title, subtitle, image, count }: Props) {
  const t = useTranslations("tour");

  return (
    <section className="relative flex h-[70vh] min-h-[500px] items-center overflow-hidden bg-background">
      <div
        className="absolute inset-0 z-0 scale-110 bg-cover bg-center transition-transform duration-[3000ms] hover:scale-100"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-white/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/15 to-transparent" />
      </div>

      <div className="absolute right-[10%] top-1/4 h-64 w-64 animate-pulse rounded-full bg-primary/10 blur-[100px]" />

      <div className="design-container relative z-10">
        <div className="max-w-4xl space-y-8">
          <div className="reveal-up inline-flex items-center gap-3 rounded-full border border-primary/20 bg-white/92 px-4 py-2 shadow-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {t("list.hero_badge", { count })}
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="reveal-up text-6xl font-semibold leading-[0.9] tracking-tighter text-on-surface md:text-3xl" style={{ animationDelay: "100ms" }}>
              <span className="block text-primary">Discover</span>
              <span className="block">{title}</span>
            </h1>

            <p className="reveal-up max-w-2xl text-xl font-medium leading-relaxed text-on-surface-subtle md:text-2xl" style={{ animationDelay: "200ms" }}>
              {subtitle}
            </p>
          </div>

          <div className="reveal-up flex gap-4" style={{ animationDelay: "300ms" }}>
            <div className="mt-4 h-px w-20 self-start bg-primary opacity-50" />
            <p className="text-sm font-semibold uppercase tracking-widest text-primary/80">
              Premium Experiences curated for you
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-10 h-32 w-full bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
