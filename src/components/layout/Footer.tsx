"use client";

import { memo, useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { IconType } from "@/components/icons/solar";
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoYoutube,
  IoEarthOutline,
} from "@/components/icons/solar";
import { ROUTES, QUICK_LINKS } from "@/config";
import { useAppConfig } from "@/hooks/use-app-config";

const Footer = () => {
  const t = useTranslations("common");
  const { data: siteConfig } = useAppConfig();
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    setLogoFailed(false);
  }, [siteConfig?.brand?.logo]);

  const socialLinks: { icon: IconType; color: string; path: string | null }[] = [
    { icon: IoLogoFacebook, color: "hover:bg-[#1877F2]", path: siteConfig?.social_links?.facebook ?? null },
    { icon: IoLogoInstagram, color: "hover:bg-[#E4405F]", path: siteConfig?.social_links?.instagram ?? null },
    { icon: IoLogoYoutube, color: "hover:bg-[#FF0000]", path: siteConfig?.social_links?.youtube ?? null },
    { icon: IoEarthOutline, color: "hover:bg-primary", path: siteConfig?.social_links?.website ?? ROUTES.CONTACT },
  ];

  return (
    <footer className="relative mx-auto mb-6 w-[calc(100%-3rem)] select-none overflow-hidden rounded-[28px] border border-border bg-white px-6 pb-10 pt-16 text-on-surface shadow-[0_24px_80px_rgba(15,23,42,0.08)] md:w-[calc(100%-4rem)] md:px-16 lg:w-[calc(100%-5rem)]">
      <div className="relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Brand & Social */}
          <div className="space-y-6 text-center md:text-left">
            <Link href={ROUTES.HOME} className="flex items-center justify-center md:justify-start gap-2 group">
              {siteConfig?.brand?.logo && !logoFailed ? (
                <div className="w-12 h-12 rounded-xl border border-border overflow-hidden bg-white p-0.5 flex items-center justify-center shrink-0">
                  <Image
                    src={siteConfig.brand.logo}
                    alt={siteConfig?.brand?.website_name || t("common.brand_name")}
                    width={48}
                    height={48}
                    className="h-full w-full object-contain"
                    onError={() => setLogoFailed(true)}
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-[#f7f7f7] text-on-surface">
                  <span className="text-2xl font-bold uppercase">
                    {(siteConfig?.brand?.website_name || t("common.brand_name")).charAt(0)}
                  </span>
                </div>
              )}
              <span className="text-2xl font-bold tracking-tight uppercase">
                {(siteConfig?.brand?.website_name || t("common.brand_name")).split(" ")[0]}{" "}
                <span className="text-primary">
                  {(siteConfig?.brand?.website_name || t("common.brand_name")).split(" ").slice(1).join(" ")}
                </span>
              </span>
            </Link>
            <p className="text-on-surface-subtle text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              {t("footer.description")}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              {socialLinks.map((social, idx) => {
                const IconComponent = social.icon;
                const baseClass = `w-10 h-10 rounded-full bg-[#f7f7f7] border border-border flex items-center justify-center text-xl transition-all duration-300 ${social.color} text-on-surface-subtle hover:text-white`;
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
                    className={`${baseClass} hover:scale-110 active:scale-95 hover:border-primary`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links / Explore */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-6 text-on-surface uppercase tracking-[0.15em]">
              {t("footer.quick_links")}
            </h4>
            <ul className="space-y-4">
              {QUICK_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-on-surface-subtle hover:text-primary transition-all duration-300 flex items-center justify-center md:justify-start gap-2 text-sm"
                  >
                    {t(link.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-6 text-on-surface uppercase tracking-[0.15em]">
              {t("footer.for_partners")}
            </h4>
            <ul className="space-y-4">
              <li><Link href={ROUTES.CONTACT} className="text-on-surface-subtle hover:text-primary transition-all duration-300 text-sm">{t("footer.contact")}</Link></li>
              <li><Link href={ROUTES.CONTACT} className="text-on-surface-subtle hover:text-primary transition-all duration-300 text-sm">{t("footer.support")}</Link></li>
              <li>
                <Link
                  href={ROUTES.TERMS}
                  className="text-on-surface-subtle hover:text-primary transition-all duration-300 text-sm block"
                >
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.PRIVACY}
                  className="text-on-surface-subtle hover:text-primary transition-all duration-300 text-sm block"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-6 text-on-surface uppercase tracking-[0.15em]">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-4 text-sm text-on-surface-subtle">
              <li className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-primary font-medium">{t("footer.contact_info.hotline")}:</span>
                <a href={`tel:${siteConfig?.hotline || t("footer.contact_info.default_hotline")}`} className="hover:text-primary transition-colors">
                  {siteConfig?.hotline || t("footer.contact_info.default_hotline")}
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-primary font-medium">{t("footer.contact_info.email")}:</span>
                <a href={`mailto:${siteConfig?.email || t("footer.contact_info.default_email")}`} className="hover:text-primary transition-colors">
                  {siteConfig?.email || t("footer.contact_info.default_email")}
                </a>
              </li>
              <li className="flex items-start justify-center md:justify-start gap-3">
                <span className="text-primary shrink-0 font-medium">{t("footer.contact_info.address")}:</span>
                <span>{siteConfig?.address || t("footer.contact_info.default_address")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-on-surface-variant text-xs tracking-wide">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center gap-8 text-xs text-on-surface-variant font-medium">
            {/* Link components can be added here if needed */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
