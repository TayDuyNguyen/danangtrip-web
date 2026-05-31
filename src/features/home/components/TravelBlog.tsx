"use client";

import { memo } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import { useTranslations, useLocale } from "next-intl";
import { IoCalendarOutline } from "@/components/icons/solar";
import { useBlog } from "../hooks/use-blog";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { getHomeBlogImage } from "../utils/home-image-fallbacks";

const TravelBlog = () => {
  const t = useTranslations();
  const locale = useLocale();
  const { elementRef, isVisible } = useScrollReveal();
  const { latestBlogs: blogs, isLoading } = useBlog();

  // Pick first blog as hero, next 4 as grid items
  const heroPost = blogs?.[0];
  const gridPosts = blogs?.slice(1, 5) || [];

  return (
    <section className="py-6 bg-surface/12 backdrop-blur-[1px] font-sans overflow-hidden">
      <div className="design-container" ref={elementRef}>
        {/* Header */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between mb-6 gap-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className={`max-w-2xl px-4 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-primary/40" />
              <span className="text-primary font-black text-[12px] tracking-[0.4em] uppercase">
                {t("home.blog.tagline")}
              </span>
            </div>
            <h2 className="text-[36px] md:text-[48px] font-black leading-[1.1] text-on-surface">
              {t("home.blog.title_prefix")} <span className="text-primary underline decoration-[#8b6a55]/30 underline-offset-8">{t("home.blog.title_highlight")}</span>
            </h2>
          </div>
          <Link
            href={String(ROUTES.BLOG)}
            className={`mb-2 flex items-center rounded-full border border-border bg-white px-6 py-3 text-[14px] font-semibold text-on-surface shadow-sm transition-all duration-300 hover:border-primary/30 hover:bg-[#f7f7f7] hover:text-primary ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            {t("home.hot_tours.explore_more")} <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Premium Grid Layout */}
        <div className={`transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {isLoading ? (
            // Skeleton Loader matching the editorial grid structure
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Skeleton (Hero Card) */}
              <div className="relative flex h-[500px] flex-col justify-end rounded-[28px] border border-border bg-[#f7f7f7] p-8 animate-pulse lg:col-span-7 lg:h-[600px]">
                <div className="h-6 w-24 bg-[#1c1c1c] rounded-full mb-6" />
                <div className="h-10 w-3/4 bg-[#1c1c1c] rounded mb-4" />
                <div className="h-4 w-1/2 bg-[#1c1c1c] rounded mb-8" />
                <div className="absolute bottom-8 right-8 h-12 w-36 bg-[#1c1c1c] rounded-full" />
              </div>

              {/* Right Skeletons (4 Grid Cards) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="relative flex h-[288px] flex-col justify-end rounded-[28px] border border-border bg-[#f7f7f7] p-6 animate-pulse">
                    <div className="absolute top-4 right-4 h-6 w-16 bg-[#1c1c1c] rounded-full" />
                    <div className="h-3 w-20 bg-[#1c1c1c] rounded mb-3" />
                    <div className="h-5 w-5/6 bg-[#1c1c1c] rounded" />
                  </div>
                ))}
              </div>
            </div>
          ) : heroPost ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: 1 Large Hero Card */}
              <div className="lg:col-span-7 flex flex-col">
                <Link
                  href={`${ROUTES.BLOG}/${heroPost.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-border h-[500px] lg:h-[600px] flex flex-col justify-end p-8 md:p-12 shadow-2xl transition-all duration-500 hover:border-primary/30 hover:shadow-[0_30px_60px_rgba(139,106,85,0.15)] cursor-pointer"
                >
                  {/* Hero Background Image */}
                  <Image
                    src={getHomeBlogImage(heroPost.featured_image, heroPost.id)}
                    alt={heroPost.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 700px"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    priority
                  />
                  {/* Premium Editorial Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                  {/* Left Column Text Overlay */}
                  <div className="relative z-10 flex flex-col max-w-xl">
                    <span className="self-start bg-primary text-white text-[10px] font-black tracking-wider uppercase px-4 py-2 rounded-full mb-6 border border-white/10 shadow-md">
                      {heroPost.categories?.[0]?.name || t("common.brand_name")}
                    </span>

                    <h3 className="text-white text-[28px] md:text-[36px] font-black leading-[1.15] mb-4 drop-shadow-2xl group-hover:text-primary transition-colors duration-300">
                      {heroPost.title}
                    </h3>

                    <p className="mb-2 text-[14px] font-medium leading-relaxed text-white/82 drop-shadow line-clamp-2 md:text-[15px]">
                      {heroPost.excerpt || (heroPost.content ? heroPost.content.substring(0, 140).replace(/<[^>]*>/g, '') + "..." : "")}
                    </p>
                  </div>

                  {/* Bottom Right Glass Pill Button */}
                  <div className="absolute bottom-8 right-8 z-20">
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[13px] font-semibold uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:bg-primary-hover">
                      {t("home.blog.read_more")} <span className="text-[14px]">→</span>
                    </span>
                  </div>
                </Link>
              </div>

              {/* Right Column: 4 Grid Cards */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {gridPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`${ROUTES.BLOG}/${post.slug}`}
                    className="group relative h-[288px] rounded-2xl overflow-hidden border border-border flex flex-col justify-end p-6 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_40px_rgba(139,106,85,0.15)] transition-all duration-500 cursor-pointer shadow-lg"
                  >
                    {/* Background Image */}
                    <Image
                      src={getHomeBlogImage(post.featured_image, post.id)}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />

                    {/* Small category tag in top right */}
                    <span className="absolute right-4 top-4 z-10 rounded-full border border-border bg-white/95 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
                      {post.categories?.[0]?.name || "Travel"}
                    </span>

                    {/* Content overlay */}
                    <div className="relative z-10 w-full flex flex-col">
                      <span className="mb-2 flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-white/76">
                        <IoCalendarOutline size={12} className="text-primary/70" />
                        {post.created_at ? new Date(post.created_at).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US') : "18/04/2026"}
                      </span>

                      {/* Translucent bottom bar */}
                      <div className="flex items-center justify-between gap-3 mt-1 pt-3 border-t border-border/40">
                        <h4 className="text-white text-[15px] font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-snug flex-1">
                          {post.title}
                        </h4>
                        <span className="text-primary text-[18px] font-black group-hover:translate-x-1.5 transition-transform duration-300">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            // Fallback empty state
            <div className="w-full py-20 flex flex-col items-center justify-center text-on-surface-subtle bg-surface-container/30 rounded-xl border border-dashed border-border">
              <p className="text-[16px] font-medium">{t("home.featured_locations.no_data")}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default memo(TravelBlog);
