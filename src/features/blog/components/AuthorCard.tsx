import Image from "next/image";
import { useTranslations } from "next-intl";
import { BlogAuthor } from "@/types";
import { IoLogoFacebook, IoLogoInstagram, IoLogoYoutube } from "@/components/icons/solar";

interface AuthorCardProps {
  author: BlogAuthor;
}

/**
 * Molecule: AuthorCard
 * Updated to match Stitch design:
 * - Horizontal layout with large avatar (16x16 w/h)
 * - "Tác giả" label in monospace uppercase brand color above name
 * - Glass-retro panel, subtle social icon buttons
 */
export const AuthorCard = ({ author }: AuthorCardProps) => {
  const t = useTranslations("blog");

  return (
    <section className="glass-retro rounded-2xl p-6 reveal-up">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shrink-0 border-2 border-primary/30 shadow-lg shadow-primary/10">
          <Image
            src={author.avatar || "/images/placeholder-avatar.jpg"}
            alt={author.full_name}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 text-center sm:text-left space-y-3">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-primary uppercase tracking-[0.2em]">
              {t("author")}
            </span>
            <h4 className="text-xl font-semibold text-white tracking-tight">
              {author.full_name}
            </h4>
          </div>

          <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">
            {author.bio ||
              "Chuyên gia du lịch tại Đà Nẵng, đam mê khám phá và chia sẻ những góc nhìn mới lạ về thành phố đáng sống nhất Việt Nam."}
          </p>

          {/* Social Links */}
          <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
            {author.social_links?.facebook && (
              <a
                href={author.social_links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-neutral-400 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300"
              >
                <IoLogoFacebook size={18} />
              </a>
            )}
            {author.social_links?.instagram && (
              <a
                href={author.social_links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-neutral-400 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300"
              >
                <IoLogoInstagram size={18} />
              </a>
            )}
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-neutral-400 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 cursor-pointer">
              <IoLogoYoutube size={18} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
