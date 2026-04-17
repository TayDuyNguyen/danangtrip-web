"use client";

import { memo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { IoBookOutline, IoArrowForward, IoTimeOutline, IoEyeOutline } from "react-icons/io5";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config";

const TravelBlog = () => {
  const t = useTranslations("home");

  const articles = [
    {
      id: 1,
      title: t("blog.article1_title"),
      desc: t("blog.article1_desc"),
      image: "/images/discovery/my-khe.png",
      date: "12/04/2026",
      views: "1.2k",
      category: "Ẩm thực"
    },
    {
      id: 2,
      title: t("blog.article2_title"),
      desc: t("blog.article2_desc"),
      image: "/images/discovery/dragon-bridge.png",
      date: "10/04/2026",
      views: "2.5k",
      category: "Lịch trình"
    },
    {
      id: 3,
      title: t("blog.article3_title"),
      desc: t("blog.article3_desc"),
      image: "/images/discovery/hoi-an.png",
      date: "08/04/2026",
      views: "850",
      category: "Chill"
    }
  ];

  return (
    <section className="py-24 bg-gray-50/50">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 underline-cyan-400">
          <div className="max-w-2xl">
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              {t("blog.title")}
            </h2>
          </div>

          <Link
            href={ROUTES.BLOG}
            className="flex items-center gap-3 px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-2xl font-bold hover:bg-gray-900 hover:text-white transition-all duration-300 group h-fit"
          >
            <IoBookOutline className="text-xl" />
            {t("blog.cta")}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={ROUTES.BLOG}
              className="flex flex-col group cursor-pointer"
            >
              <div className="relative aspect-16/10 rounded-3xl overflow-hidden mb-8 shadow-md group-hover:shadow-2xl transition-all duration-500">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 bg-cyan-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg shadow-lg">
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-gray-400 text-xs font-bold mb-4 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <IoTimeOutline className="text-sm" />
                  {article.date}
                </div>
                <div className="flex items-center gap-2">
                  <IoEyeOutline className="text-sm" />
                  {article.views} views
                </div>
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-cyan-500 transition-colors leading-tight line-clamp-2 uppercase">
                {article.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-8 font-medium">
                {article.desc}
              </p>

              <div className="mt-auto flex items-center gap-2 text-gray-900 font-bold group-hover:text-cyan-500 transition-colors group/link underline decoration-2 decoration-transparent group-hover:decoration-cyan-500/30 underline-offset-8">
                Read Article
                <IoArrowForward className="group-hover/link:translate-x-2 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(TravelBlog);
