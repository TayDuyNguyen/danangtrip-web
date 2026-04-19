"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { 
  IoShieldCheckmarkOutline, 
  IoFlashOutline, 
  IoHeadsetOutline, 
  IoWalletOutline 
} from "react-icons/io5";


const Discovery = () => {
  const t = useTranslations();

  const features = [
    {
      id: 1,
      title: "Tối ưu chi phí",
      desc: "Cam kết giá tốt nhất với nhiều chương trình ưu đãi hấp dẫn hàng tháng.",
      icon: <IoWalletOutline className="text-3xl text-sun" />,
      bg: "bg-orange-50",
    },
    {
      id: 2,
      title: "Đặt chỗ dễ dàng",
      desc: "Hệ thống đặt giữ chỗ linh hoạt, xác nhận ngay lập tức qua Email/SMS.",
      icon: <IoFlashOutline className="text-3xl text-[#3B82F6]" />,
      bg: "bg-blue-50",
    },
    {
      id: 3,
      title: "Hỗ trợ 24/7",
      desc: "Đội ngũ nhân viên chuyên nghiệp sẵn sàng hỗ trợ bạn mọi lúc mọi nơi.",
      icon: <IoHeadsetOutline className="text-3xl text-[#10B981]" />,
      bg: "bg-green-50",
    },
    {
      id: 4,
      title: "Dịch vụ uy tín",
      desc: "Hơn 10 năm kinh nghiệm tổ chức tour và dịch vụ du lịch tại Đà Nẵng.",
      icon: <IoShieldCheckmarkOutline className="text-3xl text-[#F59E0B]" />,
      bg: "bg-amber-50",
    },
  ];

  return (
    <section className="py-[120px] bg-surface reveal-up">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20 px-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-12 h-[2px] bg-azure/30" />
            <span className="text-azure font-black text-[12px] tracking-[0.4em] uppercase">{t("home.discovery.tagline")}</span>
            <span className="w-12 h-[2px] bg-azure/30" />
          </div>
          <h2 className="text-[32px] md:text-[48px] font-black text-dark leading-tight mb-8">
            {t("home.discovery.title")}
          </h2>
          <p className="text-[16px] md:text-lg text-slate-500 font-medium leading-relaxed">
            {t("home.discovery.subtitle")}
          </p>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group p-10 bg-surface-container-lowest rounded-[24px] shadow-[0_15px_30px_rgba(23,28,31,0.04)] hover:shadow-2xl hover:shadow-azure/10 transition-all duration-700 hover:-translate-y-3 flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-azure/5 rounded-bl-full -mr-10 -mt-10 group-hover:bg-azure/10 transition-colors duration-700" />
              
              <div className="w-20 h-20 rounded-2xl bg-surface-container flex items-center justify-center mb-10 transform transition-all duration-700 group-hover:rotate-15 group-hover:scale-110 shadow-sm relative z-10">

                {feature.icon}
              </div>
              <h3 className="text-[20px] font-bold text-dark mb-5 group-hover:text-azure transition-colors uppercase tracking-tight relative z-10">
                {feature.title}
              </h3>
              <p className="text-[14px] md:text-[15px] text-slate-500 leading-relaxed font-medium relative z-10">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

  );
};

export default memo(Discovery);
