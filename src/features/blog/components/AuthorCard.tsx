import Image from "next/image";
import { useTranslations } from "next-intl";
import { BlogAuthor } from "@/types";
import { IoLogoFacebook, IoLogoInstagram, IoLogoYoutube } from "@/components/icons/solar";

interface AuthorCardProps {
  author: BlogAuthor;
}

/**
 * Molecule: AuthorCard
 * Displays author info with social links.
 * Glass surface and gradient border shell according to DESIGN.md.
 */
export const AuthorCard = ({ author }: AuthorCardProps) => {
  const t = useTranslations("blog");

  return (
    <section className="relative p-8 rounded-3xl overflow-hidden glass-surface border border-white/10 reveal-up">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Avatar Shell */}
        <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0 border-2 border-white/10 shadow-2xl">
          <Image
            src={author.avatar || "/images/placeholder-avatar.jpg"}
            alt={author.full_name}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <header className="space-y-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
              {t("author")}
            </span>
            <h4 className="text-2xl font-bold text-white tracking-tight">
              {author.full_name}
            </h4>
          </header>

          <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">
            {author.bio || "Chuyên gia du lịch tại Đà Nẵng, đam mê khám phá và chia sẻ những góc nhìn mới lạ về thành phố đáng sống nhất Việt Nam."}
          </p>

          {/* Social Links */}
          <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
            {author.social_links?.facebook && (
              <a href={author.social_links.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-neutral-400 hover:bg-primary hover:text-white transition-all duration-300">
                <IoLogoFacebook size={20} />
              </a>
            )}
            {author.social_links?.instagram && (
              <a href={author.social_links.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-neutral-400 hover:bg-primary hover:text-white transition-all duration-300">
                <IoLogoInstagram size={20} />
              </a>
            )}
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-neutral-400 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
              <IoLogoYoutube size={20} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
