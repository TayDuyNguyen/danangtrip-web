"use client";

import { memo } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";
import { useTranslations } from "next-intl";
import { IoArrowForwardOutline, IoCalendarOutline } from "react-icons/io5";
import { useBlog } from "../hooks/use-blog";

const TravelBlog = () => {
  const { latestBlogs: blogs } = useBlog();
  const t = useTranslations();

  if (blogs.length === 0) return null;

  return (
    <section className="py-[100px] bg-[#F8FAFC] font-sans">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 reveal-up">
          <div className="max-w-2xl">
            <span className="text-azure font-bold text-[14px] tracking-[0.3em] uppercase mb-4 block">
              {t("home.blog.tagline")}
            </span>
            <h2 className="text-[36px] md:text-[48px] font-black leading-[1.1]">
              {t("home.blog.title_prefix")} <span className="text-azure underline decoration-azure/30 underline-offset-8">{t("home.blog.title_highlight")}</span>
            </h2>
          </div>
          <Link
            href={ROUTES.BLOG}
            className="flex items-center gap-2 text-azure font-black hover:gap-4 transition-all group"
          >
            {t("home.blog.see_all")} <IoArrowForwardOutline size={20} className="transition-transform" />
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((post, index) => (
            <article
              key={post.id}
              className="group bg-white rounded-[40px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 reveal-up"
              style={{ animationDelay: `${(index + 1) * 200}ms` }}
            >
              <Link href={`${ROUTES.BLOG}/${post.slug}`}>
                <div className="relative aspect-16/10 overflow-hidden">
                  <Image
                    src={post.featured_image || "/images/placeholder.png"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6 flex gap-2">
                    {post.categories?.slice(0, 1).map((cat) => (
                      <span key={cat.id} className="bg-white/90 backdrop-blur-md text-azure text-[11px] font-bold px-4 py-2 rounded-full shadow-sm">
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-10">
                  <div className="flex items-center gap-3 text-slate-400 text-[13px] font-medium mb-4">
                    <IoCalendarOutline size={16} className="text-azure" />
                    {post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : "18/04/2026"}
                  </div>
                  <h3 className="text-[22px] font-black text-dark mb-6 leading-tight group-hover:text-azure transition-colors line-clamp-2 min-h-[54px]">
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-100 relative">
                        {post.author?.avatar ? (
                          <Image src={post.author.avatar} alt={post.author.full_name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-azure font-bold text-[12px]">
                            DT
                          </div>
                        )}
                      </div>
                      <span className="text-[13px] font-black text-slate-600">{post.author?.full_name || "Admin"}</span>
                    </div>
                    <span className="text-azure font-black text-[14px] flex items-center gap-2 group-hover:gap-3 transition-all">
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
