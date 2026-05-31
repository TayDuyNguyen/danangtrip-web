"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/utils/string";
import { CheckCircle2 } from "@/components/icons/solar";

interface BookingProgressStepsProps {
  currentStep: number;
}

export function BookingProgressSteps({ currentStep }: BookingProgressStepsProps) {
  const t = useTranslations("tour.booking");

  const steps = [
    { id: 1, label: t("step_info") },
    { id: 2, label: t("step_payment") },
    { id: 3, label: t("step_confirm") },
  ];

  return (
    <div className="w-full max-w-[600px] mx-auto px-4 py-8 reveal-up">
      <div className="flex justify-between items-center relative">
        {/* Connecting Lines */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border -translate-y-1/2 z-0" />
        
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-3 bg-white px-4 first:pl-0 last:pr-0">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500",
                  isActive 
                    ? "bg-primary text-white shadow-[0_0_15px_rgba(139,106,85,0.4)] scale-110" 
                    : isCompleted 
                      ? "bg-primary text-white" 
                      : "bg-[#f7f7f7] text-on-surface-subtle border border-border"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <span 
                className={cn(
                  "text-[11px] font-bold uppercase tracking-wider transition-colors duration-500 whitespace-nowrap",
                  isActive ? "text-primary" : "text-on-surface-subtle"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
