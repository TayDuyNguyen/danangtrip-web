"use client";

import { memo } from "react";
import { 
  IoShieldCheckmarkOutline, 
  IoFlashOutline, 
  IoHeadsetOutline, 
  IoWalletOutline 
} from "react-icons/io5";

const Discovery = () => {
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
    <section className="py-[120px] bg-white reveal-up">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-12 h-[2px] bg-azure" />
            <span className="text-azure font-black text-[14px] tracking-[0.3em] uppercase">Tại sao chọn chúng tôi</span>
            <span className="w-12 h-[2px] bg-azure" />
          </div>
          <h2 className="text-[32px] md:text-[48px] font-black text-[#1E293B] leading-tight mb-6">
            Trải nghiệm Đà Nẵng trọn vẹn cùng Đà Nẵng Trip
          </h2>
          <p className="text-[16px] md:text-lg text-gray-500 font-medium">
            Chúng tôi tự hào mang đến những dịch vụ du lịch chất lượng, minh bạch và tận tâm nhất dành cho du khách.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group p-10 bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center"
            >
              <div className={`w-20 h-20 rounded-3xl ${feature.bg} flex items-center justify-center mb-8 transform transition-transform duration-500 group-hover:rotate-12 shadow-sm`}>
                {feature.icon}
              </div>
              <h3 className="text-[20px] font-bold text-[#1E293B] mb-4 group-hover:text-azure transition-colors uppercase tracking-tight">
                {feature.title}
              </h3>
              <p className="text-[14px] md:text-[15px] text-gray-500 leading-relaxed font-medium capitalize">
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
