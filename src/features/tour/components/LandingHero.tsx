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
    <section className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden bg-background">
      {/* Background Image with Parallax-like Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[3000ms] scale-110 hover:scale-100"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </div>

      {/* Decorative Floating Element */}
      <div className="absolute top-1/4 right-[10%] w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />

      <div className="design-container relative z-10">
        <div className="max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-surface border border-primary/20 reveal-up">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">
              {t("list.hero_badge", { count })}
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black text-on-surface tracking-tighter leading-[0.9] uppercase reveal-up" style={{ animationDelay: "100ms" }}>
              <span className="block text-primary">Discover</span>
              <span className="block">{title}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-on-surface-subtle leading-relaxed max-w-2xl reveal-up font-medium" style={{ animationDelay: "200ms" }}>
              {subtitle}
            </p>
          </div>

          <div className="flex gap-4 reveal-up" style={{ animationDelay: "300ms" }}>
            <div className="h-px w-20 bg-primary mt-4 self-start opacity-50" />
            <p className="text-sm uppercase tracking-widest text-primary/80 font-bold">
              Premium Experiences curated for you
            </p>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator or bottom gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
