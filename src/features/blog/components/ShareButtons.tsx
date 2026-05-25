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
    <div className="p-6 glass-retro rounded-2xl space-y-4">
      <h3 className="text-lg font-semibold text-white border-l-4 border-primary pl-3">
        {t("share")}
      </h3>

      <div className="flex gap-3">
        <button
          onClick={handleShareFB}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300"
          title={t("share_fb")}
        >
          <IoLogoFacebook size={20} />
        </button>
        <button
          onClick={handleShareX}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300"
          title={t("share_x")}
        >
          <IoLogoTwitter size={20} />
        </button>
        <button
          onClick={handleCopyLink}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300"
          title={t("copy_link")}
        >
          <IoCopyOutline size={18} />
        </button>
      </div>
    </div>
  );
};
