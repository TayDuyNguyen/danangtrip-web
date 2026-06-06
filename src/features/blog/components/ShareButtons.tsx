"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { IoLogoFacebook, IoLogoTwitter, IoCopyOutline } from "@/components/icons/solar";

/**
 * Molecule: ShareButtons
 * Updated to match Stitch design:
 * - Section heading with border-l-4 brand accent
 * - Round icon buttons with glass background
 */
export const ShareButtons = () => {
  const t = useTranslations("blog");

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(t("copied"));
  };

  const handleShareFB = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  };

  const handleShareX = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?url=${url}`, "_blank");
  };

  return (
    <div className="space-y-4 rounded-[28px] border border-border bg-white p-6 shadow-[0_16px_48px_rgba(15,23,42,0.08)]">
      <h3 className="border-l-4 border-primary pl-3 text-lg font-semibold text-on-surface">
        {t("share")}
      </h3>

      <div className="flex gap-3">
        <button
          onClick={handleShareFB}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-[#f7f7f7] text-on-surface-subtle transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white"
          title={t("share_fb")}
        >
          <IoLogoFacebook size={20} />
        </button>
        <button
          onClick={handleShareX}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-[#f7f7f7] text-on-surface-subtle transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white"
          title={t("share_x")}
        >
          <IoLogoTwitter size={20} />
        </button>
        <button
          onClick={handleCopyLink}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-[#f7f7f7] text-on-surface-subtle transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white"
          title={t("copy_link")}
        >
          <IoCopyOutline size={18} />
        </button>
      </div>
    </div>
  );
};
