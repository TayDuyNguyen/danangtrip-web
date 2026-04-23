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
        console.warn("Using default config due to load failure", error);
      }
    };
    fetchConfig();
  }, []);

  const socialLinks: { icon: IconType; color: string; path: string | null }[] = [
    { icon: IoLogoFacebook, color: "hover:bg-[#1877F2]", path: siteConfig?.social_links?.facebook ?? null },
    { icon: IoLogoInstagram, color: "hover:bg-[#E4405F]", path: siteConfig?.social_links?.instagram ?? null },
    { icon: IoLogoYoutube, color: "hover:bg-[#FF0000]", path: siteConfig?.social_links?.youtube ?? null },
    { icon: IoEarthOutline, color: "hover:bg-cyan-500", path: siteConfig?.social_links?.website ?? ROUTES.CONTACT },
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
                {t("common.brand_name").split(" ")[0]} <span className="text-cyan-500">{t("common.brand_name").split(" ").slice(1).join(" ")}</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              {t("footer.description")}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              {socialLinks.map((social, idx) => {
                const IconComponent = social.icon;
                const baseClass = `w-10 h-10 rounded-xl bg-gray-800/50 border border-white/5 flex items-center justify-center text-xl transition-all duration-300 ${social.color} text-gray-400`;
                if (!social.path) {
                  return (
                    <span
                      key={idx}
                      className={`${baseClass} opacity-40 cursor-not-allowed`}
                      aria-hidden
                    >
                      <IconComponent className="w-5 h-5" />
                    </span>
                  );
                }
                return (
                  <a
                    key={idx}
                    href={social.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${baseClass} hover:scale-110 active:scale-95 hover:text-white`}
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
              {t("footer.quick_links")}
            </h4>
            <ul className="space-y-4">
              {QUICK_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-gray-400 hover:text-cyan-400 transition-all duration-300 flex items-center justify-center md:justify-start gap-2 text-sm"
                  >
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {t(link.name as any)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">
              {t("footer.for_partners")}
            </h4>
            <ul className="space-y-4">
              <li><Link href={ROUTES.CONTACT} className="text-gray-400 hover:text-cyan-400 transition-all duration-300 text-sm">{t("footer.contact")}</Link></li>
              <li><Link href={ROUTES.CONTACT} className="text-gray-400 hover:text-cyan-400 transition-all duration-300 text-sm">{t("footer.support")}</Link></li>
              <li><span className="text-gray-500 text-sm block">{t("footer.terms")} — {t("footer.coming_soon")}</span></li>
              <li><span className="text-gray-500 text-sm block">{t("footer.privacy")} — {t("footer.coming_soon")}</span></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-cyan-500 font-medium">{t("footer.contact_info.hotline")}:</span>
                <a href={`tel:${siteConfig?.hotline || t("footer.contact_info.default_hotline")}`} className="hover:text-cyan-400 transition-colors">
                  {siteConfig?.hotline || t("footer.contact_info.default_hotline")}
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-cyan-500 font-medium">{t("footer.contact_info.email")}:</span>
                <a href={`mailto:${siteConfig?.email || t("footer.contact_info.default_email")}`} className="hover:text-cyan-400 transition-colors">
                  {siteConfig?.email || t("footer.contact_info.default_email")}
                </a>
              </li>
              <li className="flex items-start justify-center md:justify-start gap-3">
                <span className="text-cyan-500 shrink-0 font-medium">{t("footer.contact_info.address")}:</span>
                <span>{siteConfig?.address || t("footer.contact_info.default_address")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-xs tracking-wide">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center gap-8 text-xs text-gray-500 font-medium">
            {/* Link components can be added here if needed */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
