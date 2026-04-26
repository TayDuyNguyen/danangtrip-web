import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function Header() {
  const t = useTranslations("common");
  return (
    <header className="bg-[#080808] border-b border-[#262626]">
      <div className="design-container">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-[#8b6a55]">
            {t("common.brand_name")}
          </Link>
          
          <nav className="flex gap-6">
            <Link href="/about" className="text-[#a3a3a3] hover:text-white">
              {t("nav.about_us")}
            </Link>
            <Link href="/tours" className="text-[#a3a3a3] hover:text-white">
              {t("nav.travel")}
            </Link>
            <Link href="/login" className="text-[#8b6a55] hover:text-[#c59a5f]">
              {t("auth.login")}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
