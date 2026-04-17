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
      name: "Nguyễn Văn An",
      role: "Khách du lịch từ Hà Nội",
      avatar: "/images/testimonials/avatar-1.png",
      content: "Chuyến đi tuyệt vời! Hướng dẫn viên rất nhiệt tình và chu đáo. Đặc biệt là bữa trưa tại Bà Nà thực sự ngon miệng.",
      rating: 5,
    },
    {
      id: 2,
      name: "Trần Thị Lan",
      role: "Khách du lịch từ TP.HCM",
      avatar: "/images/testimonials/avatar-2.png",
      content: "Tôi rất ấn tượng với dịch vụ của Đà Nẵng Trip. Quy trình đặt tour nhanh chóng, xe đưa đón hiện đại và sạch sẽ.",
      rating: 5,
    },
    {
      id: 3,
      name: "James Wilson",
      role: "Tourist from Australia",
      avatar: "/images/testimonials/avatar-3.png",
      content: "Excellent service and great tour guides. Da Nang is beautiful and the team made our stay very comfortable. Highly recommend!",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            {t("testimonials")}
          </h2>
          <p className="text-lg text-gray-600">
            {t("testimonials_desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="relative p-10 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-50 flex flex-col"
            >
              <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4">
                <FaQuoteLeft className="text-6xl text-cyan-50 opacity-50" />
              </div>

              <div className="flex gap-1 mb-6 text-yellow-400">
                {[...Array(review.rating)].map((_, i) => (
                  <IoStar key={i} />
                ))}
              </div>

              <p className="mb-8 text-lg italic text-gray-700 leading-relaxed relative z-10">
                &ldquo;{review.content}&rdquo;
              </p>

              <div className="mt-auto flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-lg shadow-gray-200">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.role}</p>
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
