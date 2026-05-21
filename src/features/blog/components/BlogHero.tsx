import { useTranslations } from "next-intl";
import SearchInput from "@/components/ui/SearchInput";

interface BlogHeroProps {
  onSearch: (query: string) => void;
  initialSearch?: string;
}

export const BlogHero = ({ onSearch, initialSearch }: BlogHeroProps) => {
  const t = useTranslations("blog");

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#8B6A55]/10 to-transparent pointer-events-none" />
      
      <div className="relative z-10 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight reveal-up">
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-[#a3a3a3] max-w-2xl mx-auto reveal-up reveal-delay-100">
            {t("subtitle")}
          </p>
        </div>

        <div className="max-w-xl mx-auto px-4 reveal-up reveal-delay-200">
          <SearchInput 
            placeholder={t("search_placeholder")}
            value={initialSearch || ""}
            onChange={onSearch}
            className="w-full h-14 bg-neutral-900/50 backdrop-blur-md border-neutral-800 rounded-full"
          />
        </div>
      </div>
    </section>
  );
};
