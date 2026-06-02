"use client";

import { memo, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import { useTranslations, useLocale } from "next-intl";
import { IoCalendarOutline } from "@/components/icons/solar";
import { useBlog } from "../hooks/use-blog";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { getHomeBlogImage } from "../utils/home-image-fallbacks";

const BLOG_GRID_SIZE = 4;
const BLOG_SLIDE_INTERVAL_MS = 6500;
const imageMotion = {
  initial: { opacity: 0, scale: 1.035, filter: "blur(3px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 1.02, filter: "blur(2px)" },
  transition: { duration: 1.15, ease: [0.16, 1, 0.3, 1] as const },
};

const copyMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

const TravelBlog = () => {
  const t = useTranslations();
  const locale = useLocale();
  const { elementRef, isVisible } = useScrollReveal();
  const { latestBlogs: blogs, isLoading } = useBlog();

  // Pick first blog as hero, then rotate the remaining payload in compact pages.
  const heroPost = blogs?.[0];
  const blogSlides = useMemo(() => {
    const posts = blogs?.slice(1, 20) || [];
    const slides = [];

    for (let index = 0; index < posts.length; index += BLOG_GRID_SIZE) {
      slides.push(posts.slice(index, index + BLOG_GRID_SIZE));
    }

    return slides;
  }, [blogs]);
  const [activeSlide, setActiveSlide] = useState(0);
  const gridPosts = blogSlides[activeSlide] || [];

  useEffect(() => {
    setActiveSlide(0);
  }, [blogSlides.length]);

  useEffect(() => {
    if (blogSlides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % blogSlides.length);
    }, BLOG_SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [blogSlides.length]);

  return (
    <section className="py-6 bg-surface/12 backdrop-blur-[1px] font-sans overflow-hidden">
      <div className="design-container" ref={elementRef}>
        {/* Header */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between mb-6 gap-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className={`max-w-2xl px-4 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-primary/40" />
              <span className="text-xs font-semibold uppercase tracking-normal text-primary">
                {t("home.blog.tagline")}
              </span>
            </div>
            <h2 className="text-[32px] font-semibold leading-[1.1] text-on-surface md:text-[44px]">
              {t("home.blog.title_prefix")} <span className="text-primary underline decoration-primary/30 underline-offset-8">{t("home.blog.title_highlight")}</span>
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
                <div className="mb-6 h-6 w-24 rounded-full bg-[#e5e5e5]" />
                <div className="mb-4 h-10 w-3/4 rounded bg-[#ebebeb]" />
                <div className="mb-8 h-4 w-1/2 rounded bg-[#e5e5e5]" />
                <div className="absolute bottom-8 right-8 h-12 w-36 rounded-full bg-[#ebebeb]" />
              </div>

              {/* Right Skeletons (4 Grid Cards) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="relative flex h-[288px] flex-col justify-end rounded-[28px] border border-border bg-[#f7f7f7] p-6 animate-pulse">
                    <div className="absolute right-4 top-4 h-6 w-16 rounded-full bg-[#e5e5e5]" />
                    <div className="mb-3 h-3 w-20 rounded bg-[#e5e5e5]" />
                    <div className="h-5 w-5/6 rounded bg-[#ebebeb]" />
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
                  className="group relative flex h-[500px] cursor-pointer flex-col justify-end overflow-hidden rounded-2xl border border-border p-8 shadow-2xl transition-all duration-500 hover:border-primary/30 hover:shadow-[0_30px_60px_rgba(255,56,92,0.14)] md:p-12 lg:h-[600px]"
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
                    <span className="mb-6 self-start rounded-full border border-white/10 bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-normal text-white shadow-md">
                      {heroPost.categories?.[0]?.name || t("common.common.brand_name")}
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
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[13px] font-semibold uppercase tracking-normal text-white shadow-lg transition-all duration-300 hover:bg-primary-hover">
                      {t("home.blog.read_more")} <span className="text-[14px]">→</span>
                    </span>
                  </div>
                </Link>
              </div>

              {/* Right Column: 4 Grid Cards */}
              <div className="lg:col-span-5">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {Array.from({ length: BLOG_GRID_SIZE }).map((_, index) => {
                      const post = gridPosts[index];

                      if (!post) {
                        return (
                          <div
                            key={`blog-empty-${index}`}
                            className="relative hidden h-[288px] overflow-hidden rounded-2xl border border-border bg-[#0c0c0c] sm:block"
                          />
                        );
                      }

                      return (
                      <Link
                        key={`blog-slot-${index}`}
                        href={`${ROUTES.BLOG}/${post.slug}`}
                        className="group relative flex h-[288px] cursor-pointer flex-col justify-end overflow-hidden rounded-2xl border border-border bg-[#0c0c0c] p-6 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_40px_rgba(255,56,92,0.12)]"
                      >
                        {/* Background Image */}
                        <AnimatePresence initial={false}>
                          <motion.div
                            key={`blog-image-${index}-${post.id}`}
                            className="absolute inset-0"
                            {...imageMotion}
                          >
                            <Image
                              src={getHomeBlogImage(post.featured_image, post.id)}
                              alt={post.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                              className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                          </motion.div>
                        </AnimatePresence>
                        {/* Dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />

                        {/* Small category tag in top right */}
                        <AnimatePresence initial={false}>
                          <motion.span
                            key={`blog-category-${index}-${post.id}`}
                            className="absolute right-4 top-4 z-10 max-w-[calc(100%-2rem)] truncate rounded-full border border-border bg-white/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-normal text-primary shadow-sm backdrop-blur-md"
                            {...copyMotion}
                          >
                            {post.categories?.[0]?.name || t("home.blog.default_category")}
                          </motion.span>
                        </AnimatePresence>

                        {/* Content overlay */}
                        <AnimatePresence initial={false}>
                          <motion.div
                            key={`blog-copy-${index}-${post.id}`}
                            className="relative z-10 w-full flex flex-col"
                            {...copyMotion}
                          >
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
                          </motion.div>
                        </AnimatePresence>
                      </Link>
                      );
                    })}
                </div>

                {blogSlides.length > 1 && (
                  <div className="mt-5 flex items-center justify-center gap-2">
                    {blogSlides.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        aria-label={`Blog slide ${index + 1}`}
                        onClick={() => setActiveSlide(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          activeSlide === index
                            ? "w-8 bg-primary shadow-[0_8px_20px_rgba(255,56,92,0.25)]"
                            : "w-2 bg-on-surface/25 hover:bg-primary/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
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
