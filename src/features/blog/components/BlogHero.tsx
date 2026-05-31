import { useTranslations } from "next-intl";
import SearchInput from "@/components/ui/SearchInput";

interface BlogHeroProps {
  onSearch: (query: string) => void;
  initialSearch?: string;
}

export const BlogHero = ({ onSearch, initialSearch }: BlogHeroProps) => {
  const t = useTranslations("blog");

  return (
    <section className="relative overflow-hidden pt-10 pb-6 md:pt-14 md:pb-8">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#fff1f3] to-transparent" />
      
      <div className="relative z-10 space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="reveal-up text-4xl font-semibold tracking-[-0.04em] text-on-surface md:text-[60px]">
            {t("title")}
          </h1>
          <p className="mx-auto max-w-2xl reveal-up reveal-delay-100 text-lg text-on-surface-subtle md:text-xl">
            {t("subtitle")}
          </p>
        </div>

        <div className="max-w-xl mx-auto px-4 reveal-up reveal-delay-200">
          <SearchInput 
            placeholder={t("search_placeholder")}
            value={initialSearch || ""}
            onChange={onSearch}
            className="w-full"
            label="Search articles"
            actionText="Search"
          />
        </div>
      </div>
    </section>
  );
};
