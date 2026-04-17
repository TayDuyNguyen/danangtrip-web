"use client";

import { memo } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { IconType } from "react-icons";
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoYoutube,
  IoMailOutline,
  IoArrowForward,
  IoEarthOutline,
} from "react-icons/io5";
import { ROUTES } from "@/config";

const Footer = () => {
  const t = useTranslations("common");
  const socialLinks: { icon: IconType; color: string; path: string }[] = [
    { icon: IoLogoFacebook, color: "hover:bg-[#1877F2]", path: "#" },
    { icon: IoLogoInstagram, color: "hover:bg-[#E4405F]", path: "#" },
    { icon: IoLogoYoutube, color: "hover:bg-[#FF0000]", path: "#" },
    { icon: IoEarthOutline, color: "hover:bg-cyan-500", path: "#" },
  ];

  const quickLinks = [
    { name: t("footer.about_us"), path: ROUTES.ABOUT },
    { name: t("nav.travel"), path: ROUTES.TOURS },
  ];

  const partnerLinks: { name: string; path: string }[] = [];

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
              {t("footer.description")}
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

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">
              {t("footer.quick_links")}
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link: { name: string; path: string }) => (
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

          {/* Partnership */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">
              {t("footer.for_partners")}
            </h4>
            <ul className="space-y-4">
              {partnerLinks.length > 0 ? (
                partnerLinks.map((link: { name: string; path: string }) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className="text-gray-400 hover:text-cyan-400 transition-all duration-300 flex items-center justify-center md:justify-start gap-2 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm italic">{t("footer.coming_soon") || "Coming soon"}</li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">
              {t("footer.newsletter")}
            </h4>
            <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto md:mx-0">
              {t("footer.newsletter_desc")}
            </p>
            <form
              className="relative group max-w-xs mx-auto md:mx-0"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <IoMailOutline className="text-gray-500 group-focus-within:text-cyan-500 transition-colors text-lg" />
              </div>
              <input
                type="email"
                required
                placeholder="Email..."
                className="w-full bg-gray-800/50 border border-white/5 rounded-xl py-4 pl-12 pr-12 text-sm focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder-gray-600 h-14 text-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-cyan-500 text-white px-4 rounded-lg text-sm font-semibold hover:bg-cyan-600 transition-all flex items-center gap-2 group/btn active:scale-95 shadow-lg shadow-cyan-500/20"
                aria-label={t("footer.subscribe")}
              >
                <IoArrowForward className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-xs tracking-wide">
            {t("footer.copyright")}
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
