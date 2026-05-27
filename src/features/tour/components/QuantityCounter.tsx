"use client";

import React, { useState, useEffect } from "react";
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
  const [inputValue, setInputValue] = useState(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const handleDecrement = () => {
    if (!disabled && value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (!disabled && value < max) onChange(value + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    setInputValue(rawVal);

    const parsed = parseInt(rawVal, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      onChange(clamped);
    }
  };

  const handleBlur = () => {
    // Re-sync input field with the validated value on blur
    setInputValue(String(value));
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
          className={cn(
            "w-8 h-8 rounded-full border flex items-center justify-center transition-all active:scale-90",
            disabled || value <= min
              ? "border-white/5 text-white/20 cursor-not-allowed bg-transparent"
              : "border-white/20 bg-white/5 text-white hover:bg-primary/20 hover:border-primary hover:text-primary"
          )}
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={disabled}
          min={min}
          max={max}
          className={cn(
            "w-12 text-center text-lg font-black tabular-nums bg-transparent border-b border-transparent hover:border-white/10 focus:border-primary focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:margin-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:margin-0 [&::-webkit-inner-spin-button]:appearance-none",
            disabled && "opacity-50"
          )}
          aria-label={label}
        />

        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className={cn(
            "w-8 h-8 rounded-full border flex items-center justify-center transition-all active:scale-90",
            disabled || value >= max
              ? "border-white/5 text-white/20 cursor-not-allowed bg-transparent"
              : "border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-white hover:border-primary"
          )}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
