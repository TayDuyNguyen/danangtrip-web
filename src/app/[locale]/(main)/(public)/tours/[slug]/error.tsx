"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui";

type TourDetailErrorProps = {
  reset: () => void;
};

export default function TourDetailError({ reset }: TourDetailErrorProps) {
  const td = useTranslations("tour.detail");

  return (
    <div className="design-page layout-main-shell min-h-screen pb-20">
      <div className="design-container pt-28 md:pt-32">
        <div className="glass-shell max-w-2xl mx-auto">
          <div className="glass-inner bg-surface-container-low p-8 md:p-10 text-center space-y-4">
            <h1 className="text-2xl md:text-3xl font-black text-on-surface">
              {td("error_title")}
            </h1>
            <p className="text-on-surface-subtle">{td("error_desc")}</p>
            <div className="pt-2">
              <Button onClick={reset}>{td("retry")}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
