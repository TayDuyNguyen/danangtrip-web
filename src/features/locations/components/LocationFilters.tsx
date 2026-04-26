import { useState } from "react";
import { useTranslations } from "next-intl";
import { Category } from "@/types";
import { DANANG_DISTRICTS } from "@/utils/constants";
import { 
  IoGridOutline, 
  IoLeafOutline, 
  IoUmbrellaOutline, 
  IoBusinessOutline, 
  IoFlashOutline, 
  IoCompassOutline,
  IoStar,
  IoCloseOutline,
  IoChevronDownOutline
} from "react-icons/io5";
import { cn } from "@/utils/string";

interface LocationFiltersProps {
  activeCategories: number[];
  activeDistricts: string[];
  activePriceLevel?: number;
  activeRating?: number;
  categories: Category[];
  onCategoriesChange: (ids: number[]) => void;
  onDistrictsChange: (districts: string[]) => void;
  onPriceLevelChange: (level?: number) => void;
  onRatingChange: (rating?: number) => void;
  onReset: () => void;
}

const CategoryIcon = ({ icon, className }: { icon: string | null; className?: string }) => {
  switch (icon) {
    case "mountain": return <IoLeafOutline className={className} />;
    case "beach_access": return <IoUmbrellaOutline className={className} />;
    case "fort": return <IoBusinessOutline className={className} />;
    case "trending_up": return <IoFlashOutline className={className} />;
    case "adventure": return <IoCompassOutline className={className} />;
    default: return <IoGridOutline className={className} />;
  }
};

interface SectionHeaderProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const SectionHeader = ({ title, isExpanded, onToggle }: SectionHeaderProps) => (
  <button 
    onClick={onToggle}
    className="w-full flex items-center justify-between group pl-1 mb-6 transition-colors"
  >
    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-on-surface-variant/50 group-hover:text-[#8b6a55] transition-colors">
      {title}
    </h4>
    <IoChevronDownOutline className={cn(
      "text-lg text-on-surface-variant/30 transition-transform duration-500",
      isExpanded ? "rotate-0" : "-rotate-90"
    )} />
  </button>
);

export default function LocationFilters({ 
  activeCategories, 
  activeDistricts, 
  activePriceLevel,
  activeRating,
  categories,
  onCategoriesChange, 
  onDistrictsChange,
  onPriceLevelChange,
  onRatingChange,
  onReset
}: LocationFiltersProps) {
  const t = useTranslations("locations");

  // Section expansion states
  const [expanded, setExpanded] = useState({
    categories: true,
    districts: true,
    price: true,
    rating: true
  });

  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleCategory = (id: number) => {
    const newIds = activeCategories.includes(id)
      ? activeCategories.filter(i => i !== id)
      : [...activeCategories, id];
    onCategoriesChange(newIds);
  };

  const toggleDistrict = (name: string) => {
    const newDists = activeDistricts.includes(name)
      ? activeDistricts.filter(d => d !== name)
      : [...activeDistricts, name];
    onDistrictsChange(newDists);
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl p-8 shadow-xl shadow-black/30 border border-[#262626] space-y-10">
      {/* Categories */}
      <div>
        <SectionHeader 
          title={t("filters.categories")} 
          isExpanded={expanded.categories} 
          onToggle={() => toggleSection("categories")} 
        />
        <div className={cn(
          "space-y-3 transition-all duration-500 overflow-hidden",
          expanded.categories ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}>
          {/* All Option */}
          <label className="flex items-center justify-between group cursor-pointer pb-2">
            <div className="flex items-center gap-4">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={activeCategories.length === 0}
                  onChange={() => onCategoriesChange([])}
                  className="peer appearance-none w-6 h-6 rounded-lg border-2 border-outline-variant/30 checked:bg-[#8b6a55] checked:border-[#8b6a55] transition-all duration-300"
                />
                <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 left-1 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className={cn(
                "text-[15px] font-bold transition-colors",
                activeCategories.length === 0 ? "text-[#8b6a55]" : "text-on-surface"
              )}>
                {t("filters.all")}
              </span>
            </div>
          </label>

          {categories.map((cat) => (
            <label 
              key={cat.id}
              className="flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={activeCategories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    className="peer appearance-none w-6 h-6 rounded-lg border-2 border-outline-variant/30 checked:bg-[#8b6a55] checked:border-[#8b6a55] transition-all duration-300"
                  />
                  <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 left-1 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                  activeCategories.includes(cat.id) ? "bg-[#171717] text-[#8b6a55]" : "bg-surface-container-low text-on-surface-variant/50"
                )}>
                  <CategoryIcon icon={cat.icon} className="text-xl" />
                </div>
                <span className={cn(
                  "text-[15px] font-bold transition-colors",
                  activeCategories.includes(cat.id) ? "text-[#8b6a55]" : "text-on-surface"
                )}>
                  {cat.name}
                </span>
              </div>
              <span className="text-xs font-medium text-on-surface-variant/40 group-hover:text-on-surface-variant transition-colors">
                (28)
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Districts */}
      <div>
        <SectionHeader 
          title={t("filters.districts")} 
          isExpanded={expanded.districts} 
          onToggle={() => toggleSection("districts")} 
        />
        <div className={cn(
          "space-y-3 transition-all duration-500 overflow-hidden",
          expanded.districts ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}>
          {/* All Option */}
          <label className="flex items-center justify-between group cursor-pointer pb-2">
            <div className="flex items-center gap-4">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={activeDistricts.length === 0}
                  onChange={() => onDistrictsChange([])}
                  className="peer appearance-none w-6 h-6 rounded-lg border-2 border-outline-variant/30 checked:bg-[#8b6a55] checked:border-[#8b6a55] transition-all duration-300"
                />
                <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 left-1 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className={cn(
                "text-[15px] font-bold transition-colors",
                activeDistricts.length === 0 ? "text-[#8b6a55]" : "text-on-surface"
              )}>
                {t("filters.all")}
              </span>
            </div>
          </label>

          {DANANG_DISTRICTS.map((dist) => (
            <label 
              key={dist.id}
              className="flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={activeDistricts.includes(dist.name)}
                    onChange={() => toggleDistrict(dist.name)}
                    className="peer appearance-none w-6 h-6 rounded-lg border-2 border-outline-variant/30 checked:bg-[#8b6a55] checked:border-[#8b6a55] transition-all duration-300"
                  />
                  <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 left-1 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className={cn(
                  "text-[15px] font-bold transition-colors",
                  activeDistricts.includes(dist.name) ? "text-[#8b6a55]" : "text-on-surface"
                )}>
                  {dist.name}
                </span>
              </div>
              <span className="text-xs font-medium text-on-surface-variant/40 group-hover:text-on-surface-variant transition-colors">
                (18)
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Level */}
      <div>
        <SectionHeader 
          title={t("filters.price_level")} 
          isExpanded={expanded.price} 
          onToggle={() => toggleSection("price")} 
        />
        <div className={cn(
          "space-y-3 transition-all duration-500 overflow-hidden",
          expanded.price ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}>
          {[
            { value: undefined, label: t("filters.all") },
            { value: 1, label: t("price.free") },
            { value: 2, label: t("price.budget") },
            { value: 3, label: t("price.mid_range") },
          ].map((option) => (
            <label 
              key={String(option.value)}
              className="flex items-center gap-4 group cursor-pointer"
            >
              <div className="relative flex items-center">
                <input
                  type="radio"
                  name="price_level"
                  checked={activePriceLevel === option.value}
                  onChange={() => onPriceLevelChange(option.value)}
                  className="peer appearance-none w-6 h-6 rounded-full border-2 border-outline-variant/30 checked:border-[#8b6a55] transition-all duration-300"
                />
                <div className="absolute w-3 h-3 bg-[#8b6a55] rounded-full opacity-0 peer-checked:opacity-100 left-1.5 transition-opacity" />
              </div>
              <span className={cn(
                "text-[15px] font-bold transition-colors",
                activePriceLevel === option.value ? "text-[#8b6a55]" : "text-on-surface"
              )}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <SectionHeader 
          title={t("filters.rating")} 
          isExpanded={expanded.rating} 
          onToggle={() => toggleSection("rating")} 
        />
        <div className={cn(
          "space-y-3 transition-all duration-500 overflow-hidden",
          expanded.rating ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}>
          {[
            { value: undefined, label: t("filters.all") },
            { value: 4, label: t("filters.rating_4_plus") },
            { value: 3, label: t("filters.rating_3_plus") },
          ].map((option) => (
            <label 
              key={String(option.value)}
              className="flex items-center gap-4 group cursor-pointer"
            >
              <div className="relative flex items-center">
                <input
                  type="radio"
                  name="rating"
                  checked={activeRating === option.value}
                  onChange={() => onRatingChange(option.value)}
                  className="peer appearance-none w-6 h-6 rounded-full border-2 border-outline-variant/30 checked:border-[#8b6a55] transition-all duration-300"
                />
                <div className="absolute w-3 h-3 bg-[#8b6a55] rounded-full opacity-0 peer-checked:opacity-100 left-1.5 transition-opacity" />
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-[15px] font-bold transition-colors",
                  activeRating === option.value ? "text-[#8b6a55]" : "text-on-surface"
                )}>
                  {option.label}
                </span>
                {option.value && (
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4].map(i => (
                      <IoStar key={i} className="text-xs text-amber-500" />
                    ))}
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-full py-5 px-6 bg-surface-container-low hover:bg-surface-container-high text-on-surface font-black rounded-xl transition-all active:scale-95 flex items-center justify-center gap-3 border border-[#262626] group mt-4"
      >
        <IoCloseOutline className="text-2xl group-hover:rotate-180 transition-transform duration-500" />
        {t("filters.reset")}
      </button>
    </div>
  );
}
