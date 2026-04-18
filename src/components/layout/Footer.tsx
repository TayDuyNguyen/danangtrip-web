"use client";

import { memo, useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { IconType } from "react-icons";
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoYoutube,
  IoEarthOutline,
} from "react-icons/io5";
import { ROUTES, QUICK_LINKS } from "@/config";
import { getAppConfig } from "@/services/config.service";
import type { Config } from "@/types";

const Footer = () => {
  const t = useTranslations("common");
  const [siteConfig, setSiteConfig] = useState<Config | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getAppConfig();
        if (data) setSiteConfig(data);
      } catch (error) {
        console.error("Failed to load config", error);
      }
    };
    fetchConfig();
  }, []);
  const socialLinks: { icon: IconType; color: string; path: string }[] = [
    { icon: IoLogoFacebook, color: "hover:bg-[#1877F2]", path: siteConfig?.social_links?.facebook || "#" },
    { icon: IoLogoInstagram, color: "hover:bg-[#E4405F]", path: siteConfig?.social_links?.instagram || "#" },
    { icon: IoLogoYoutube, color: "hover:bg-[#FF0000]", path: "#" },
    { icon: IoEarthOutline, color: "hover:bg-cyan-500", path: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-24 pb-12 overflow-hidden relative border-t border-gray-800">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand & Social */}
          <div className="space-y-6 text-center md:text-left">
            <Link href={ROUTES.HOME} className="flex items-center justify-center md:justify-start gap-2 group">
              <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                <span className="text-2xl font-bold uppercase">D</span>
              </div>
              <span className="text-2xl font-bold tracking-tight uppercase">
                Đà Nẵng <span className="text-cyan-500">Trip</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              {t("footer.description") || "Khám phá vẻ đẹp tuyệt vời của Đà Nẵng cùng chúng tôi. Trải nghiệm những tour du lịch độc đáo và địa điểm hấp dẫn nhất."}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              {socialLinks.map((social, idx) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.path}
                    className={`w-10 h-10 rounded-xl bg-gray-800/50 border border-white/5 flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 active:scale-95 ${social.color} hover:text-white text-gray-400`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links / Explore */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">
              Khám phá
            </h4>
            <ul className="space-y-4">
              {QUICK_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-gray-400 hover:text-cyan-400 transition-all duration-300 flex items-center justify-center md:justify-start gap-2 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">
              Hỗ trợ
            </h4>
            <ul className="space-y-4">
              <li><Link href={ROUTES.CONTACT} className="text-gray-400 hover:text-cyan-400 transition-all duration-300 text-sm">Liên hệ</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-cyan-400 transition-all duration-300 text-sm">Câu hỏi thường gặp</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-cyan-400 transition-all duration-300 text-sm">Điều khoản dịch vụ</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-cyan-400 transition-all duration-300 text-sm">Chính sách bảo mật</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">
              Liên hệ
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-cyan-500">Hotline:</span>
                <a href={`tel:${siteConfig?.hotline || "0123456789"}`} className="hover:text-cyan-400 transition-colors">{siteConfig?.hotline || "0123 456 789"}</a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-cyan-500">Email:</span>
                <a href={`mailto:${siteConfig?.email || "info@danangtrip.com"}`} className="hover:text-cyan-400 transition-colors">{siteConfig?.email || "info@danangtrip.com"}</a>
              </li>
              <li className="flex items-start justify-center md:justify-start gap-3">
                <span className="text-cyan-500 shrink-0">Địa chỉ:</span>
                <span>{siteConfig?.address || "99 Phố Tiếp, Quận Thanh Khê, Đà Nẵng"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-xs tracking-wide">
            © {new Date().getFullYear()} Đà Nẵng Trip. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-xs text-gray-500 font-medium">
            {/* Commented out non-existent privacy/terms/cookies pages */}
            {/* <Link href={ROUTES.PRIVACY} className="hover:text-cyan-500 transition-colors uppercase tracking-widest">{t("footer.privacy_policy")}</Link>
            <Link href={ROUTES.TERMS} className="hover:text-cyan-500 transition-colors uppercase tracking-widest">{t("footer.tos")}</Link>
            <Link href={ROUTES.HELP} className="hover:text-cyan-500 transition-colors uppercase tracking-widest">{t("footer.cookies")}</Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
