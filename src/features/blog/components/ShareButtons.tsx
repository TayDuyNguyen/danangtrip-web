"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { IoLogoFacebook, IoLogoTwitter, IoCopyOutline, IoShareOutline } from "@/components/icons/solar";

/**
 * Molecule: ShareButtons
 * Social sharing controls for the blog detail page.
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
    <div className="p-8 glass-surface rounded-3xl border border-white/10 space-y-6">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <IoShareOutline className="text-primary" size={20} />
        {t("share")}
      </h3>

      <div className="flex gap-4">
        <button
          onClick={handleShareFB}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-neutral-400 hover:bg-primary hover:text-white transition-all duration-300"
          title={t("share_fb")}
        >
          <IoLogoFacebook size={24} />
        </button>
        <button
          onClick={handleShareX}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-neutral-400 hover:bg-primary hover:text-white transition-all duration-300"
          title={t("share_x")}
        >
          <IoLogoTwitter size={24} />
        </button>
        <button
          onClick={handleCopyLink}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-neutral-400 hover:bg-primary hover:text-white transition-all duration-300"
          title={t("copy_link")}
        >
          <IoCopyOutline size={22} />
        </button>
      </div>
    </div>
  );
};
