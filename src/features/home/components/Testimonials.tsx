"use client";

import { memo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { IoStar } from "react-icons/io5";
import { FaQuoteLeft } from "react-icons/fa";

const Testimonials = () => {
  const t = useTranslations("home");

  const reviews = [
    {
      id: 1,
      name: t("reviews.1.name"),
      role: t("reviews.1.role"),
      avatar: "/images/testimonials/avatar-1.png",
      content: t("reviews.1.content"),
      rating: 5,
    },
    {
      id: 2,
      name: t("reviews.2.name"),
      role: t("reviews.2.role"),
      avatar: "/images/testimonials/avatar-2.png",
      content: t("reviews.2.content"),
      rating: 5,
    },
    {
      id: 3,
      name: t("reviews.3.name"),
      role: t("reviews.3.role"),
      avatar: "/images/testimonials/avatar-3.png",
      content: t("reviews.3.content"),
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-surface overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t("testimonials")}
          </h2>
          <p className="text-lg text-on-surface-variant">
            {t("testimonials_desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="relative p-10 bg-surface-container-lowest rounded-2xl shadow-xl shadow-surface-container-high/50 border border-border flex flex-col"
            >
              <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4">
                <FaQuoteLeft className="text-6xl text-azure/5 opacity-30" />
              </div>

              <div className="flex gap-1 mb-6 text-yellow-400">
                {[...Array(review.rating)].map((_, i) => (
                  <IoStar key={i} />
                ))}
              </div>

              <p className="mb-8 text-lg italic text-on-surface leading-relaxed relative z-10">
                &ldquo;{review.content}&rdquo;
              </p>

              <div className="mt-auto flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-lg shadow-surface-container-high">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{review.name}</h4>
                  <p className="text-sm text-on-surface-subtle">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(Testimonials);
