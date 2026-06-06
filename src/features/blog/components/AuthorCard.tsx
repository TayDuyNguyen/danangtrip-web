import Image from "next/image";
import { useTranslations } from "next-intl";
import { BlogAuthor } from "@/types";
import { IoLogoFacebook, IoLogoInstagram, IoLogoYoutube } from "@/components/icons/solar";

interface AuthorCardProps {
  author: BlogAuthor;
}

export const AuthorCard = ({ author }: AuthorCardProps) => {
  const t = useTranslations("blog");

  const fallbackBio =
    "Chuyen gia du lich tai Da Nang, dam me kham pha va chia se nhung goc nhin moi me ve thanh pho dang song nhat Viet Nam.";

  return (
    <section className="reveal-up rounded-[28px] border border-border bg-white p-6 shadow-[0_16px_48px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 shadow-[0_14px_30px_rgba(255,56,92,0.12)] sm:h-24 sm:w-24">
          <Image
            src={author.avatar || "/images/placeholder-avatar.jpg"}
            alt={author.full_name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 space-y-3">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">{t("author")}</span>
            <h4 className="text-xl font-semibold tracking-tight text-on-surface">{author.full_name}</h4>
          </div>

          <p className="max-w-2xl text-sm leading-relaxed text-on-surface-subtle">{author.bio || fallbackBio}</p>

          <div className="flex items-center justify-center gap-3 pt-1 sm:justify-start">
            {author.social_links?.facebook && (
              <a
                href={author.social_links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-[#f7f7f7] text-on-surface-subtle transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white"
              >
                <IoLogoFacebook size={18} />
              </a>
            )}
            {author.social_links?.instagram && (
              <a
                href={author.social_links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-[#f7f7f7] text-on-surface-subtle transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white"
              >
                <IoLogoInstagram size={18} />
              </a>
            )}
            <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-[#f7f7f7] text-on-surface-subtle transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white">
              <IoLogoYoutube size={18} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
