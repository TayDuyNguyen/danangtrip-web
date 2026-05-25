"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/utils/string";

interface QuantityCounterProps {
  label: string;
  subLabel?: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  className?: string;
  disabled?: boolean;
}

export function QuantityCounter({
  label,
  subLabel,
  value,
  onChange,
  min = 0,
  max = 20,
  className,
  disabled = false,
}: QuantityCounterProps) {
  const handleDecrement = () => {
    if (!disabled && value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (!disabled && value < max) onChange(value + 1);
  };

  return (
    <div className={cn("flex justify-between items-center py-4 border-b border-border/50 last:border-0", className)}>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-on-surface">{label}</span>
        {subLabel && <span className="text-xs text-on-surface-subtle">{subLabel}</span>}
      </div>

      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <span className={cn("w-6 text-center text-lg font-black tabular-nums", disabled && "opacity-50")}>
          {value}
        </span>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className="w-8 h-8 rounded-full bg-surface-container-high border border-border flex items-center justify-center text-on-surface hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
