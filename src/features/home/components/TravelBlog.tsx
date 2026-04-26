"use client";

import { memo } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import { useTranslations, useLocale } from "next-intl";
import { IoArrowForwardOutline, IoCalendarOutline } from "react-icons/io5";
import { useBlog } from "../hooks/use-blog";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const TravelBlog = () => {
  const { latestBlogs: blogs } = useBlog();
  const t = useTranslations();
  const locale = useLocale();
  const { elementRef, isVisible } = useScrollReveal(0.1);

  // Keep layout stable even if blogs still loading
  // if (blogs.length === 0) return null;

  return (
    <section className="py-[120px] bg-surface font-sans overflow-hidden">
      <div className="design-container" ref={elementRef}>
        {/* Header */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className={`max-w-2xl px-4 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-[#8b6a55]/40" />
              <span className="text-[#8b6a55] font-black text-[12px] tracking-[0.4em] uppercase">
                {t("home.blog.tagline")}
              </span>
            </div>
            <h2 className="text-[36px] md:text-[48px] font-black leading-[1.1] text-white">
              {t("home.blog.title_prefix")} <span className="text-[#8b6a55] underline decoration-[#8b6a55]/30 underline-offset-8">{t("home.blog.title_highlight")}</span>
            </h2>
          </div>
          <Link
            href={String(ROUTES.BLOG)}
            className={`px-6 py-3 bg-[#171717] border border-[#262626] text-[#8b6a55] text-[14px] font-bold rounded-xl shadow-sm hover:border-[#8b6a55] hover:text-white flex items-center group mb-2 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            {t("home.blog.see_all")} <IoArrowForwardOutline className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post, index) => (
            <article
              key={post.id}
              className={`group bg-surface-container-lowest rounded-xl border border-[#262626] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.25)] hover:shadow-2xl hover:shadow-[#8b6a55]/10 hover:-translate-y-2 transition-all duration-700`}
              style={{ transitionDelay: `${(index + 3) * 200}ms`, opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)" }}
            >
              <Link href={`${ROUTES.BLOG}?q=${encodeURIComponent(post.title)}` as string & {}}>
                <div className="relative aspect-16/10 overflow-hidden">
                  <Image
                    src={post.featured_image || "/images/placeholder.png"}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6 flex gap-2 z-10">
                    {post.categories?.slice(0, 1).map((cat) => (
                      <span key={cat.id} className="bg-[#171717]/90 backdrop-blur-md text-[#8b6a55] text-[10px] font-black tracking-wider uppercase px-4 py-2 rounded-full shadow-sm border border-[#262626]">
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-3 text-[#a3a3a3] text-[13px] font-medium mb-4">
                    <IoCalendarOutline size={16} className="text-[#8b6a55]/60" />
                    {post.created_at ? new Date(post.created_at).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US') : "18/04/2026"}
                  </div>
                  <h3 className="text-[20px] font-bold text-white mb-6 leading-snug group-hover:text-[#8b6a55] transition-colors line-clamp-2 min-h-[54px]">
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden relative">
                        {post.author?.avatar ? (
                          <Image src={post.author.avatar} alt={post.author.full_name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#8b6a55] font-bold text-[12px]">
                            DT
                          </div>
                        )}
                      </div>
                      <span className="text-[14px] font-bold text-[#a3a3a3] group-hover:text-white transition-colors">{post.author?.full_name || t("common.brand_name")}</span>
                    </div>
                    <span className="text-[#8b6a55] font-black text-[13px] flex items-center gap-2 group-hover:gap-3 transition-all uppercase tracking-wider">
                      {t("home.blog.read_more")} <IoArrowForwardOutline />
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(TravelBlog);
