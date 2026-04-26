"use client";

import { useTranslations } from "next-intl";
import { Tour } from "@/types";
import TourCard from "./TourCard";
import { Search } from "lucide-react";

interface TourGridProps {
  tours: Tour[];
  isLoading: boolean;
}

export default function TourGrid({ tours, isLoading }: TourGridProps) {
  const t = useTranslations("tour.empty");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-surface-container animate-pulse rounded-xl aspect-4/5" />
        ))}
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6">
          <Search className="w-10 h-10 text-on-surface-subtle" />
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-2">{t("title")}</h3>
        <p className="text-on-surface-subtle max-w-xs">{t("description")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour, index) => (
        <TourCard key={tour.id} tour={tour} index={index} />
      ))}
    </div>
  );
}
