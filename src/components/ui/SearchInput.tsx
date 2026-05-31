"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { UilSearch } from "@iconscout/react-unicons";
import { cn } from "@/utils/string";
import { debounce } from "@/utils/debounce";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  "aria-label"?: string;
  debounceMs?: number;
  label?: string;
  actionText?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder,
  isLoading,
  className,
  onFocus,
  onKeyDown,
  "aria-label": ariaLabel,
  debounceMs = 500,
  label = "Search",
  actionText = "Go",
}: SearchInputProps) {
  const autoId = useId();
  const inputId = `search-input-${autoId.replace(/:/g, "")}`;
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const debouncedOnChange = useMemo(() => {
    if (debounceMs === 0) return null;
    return debounce((val: string) => {
      onChange(val);
    }, debounceMs);
  }, [onChange, debounceMs]);

  useEffect(() => {
    return () => {
      debouncedOnChange?.cancel();
    };
  }, [debouncedOnChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);

    if (debouncedOnChange) {
      debouncedOnChange(val);
    } else {
      onChange(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      debouncedOnChange?.cancel();
      onChange(localValue);
    }

    onKeyDown?.(e);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div
        className={cn(
          "group relative flex min-h-[76px] w-full items-center overflow-hidden rounded-[24px] border border-border bg-white px-4 shadow-[0_12px_34px_rgba(0,0,0,0.07)] transition-all duration-200 hover:shadow-[0_16px_42px_rgba(0,0,0,0.1)] focus-within:border-[#222222] sm:min-h-[84px] sm:rounded-[28px] sm:px-5",
          isLoading ? "opacity-100" : ""
        )}
      >
        <div className="mr-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f7f7f7] text-[#6a6a6a] transition-colors group-focus-within:bg-[#fff1f3] group-focus-within:text-primary sm:mr-4 sm:h-12 sm:w-12">
          <UilSearch size={20} aria-hidden />
        </div>

        <div className="min-w-0 flex-1">
          <label htmlFor={inputId} className="block text-[12px] font-semibold leading-none text-on-surface">
            {label}
          </label>
          <input
            id={inputId}
            type="search"
            value={localValue}
            onChange={handleChange}
            onFocus={onFocus}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label={ariaLabel ?? placeholder ?? label}
            className="mt-2 w-full border-none bg-transparent pr-2 text-[15px] font-medium text-on-surface outline-none placeholder:text-on-surface-subtle sm:text-[16px]"
          />
        </div>

        <div className="hidden shrink-0 rounded-full bg-[#ff385c] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(255,56,92,0.24)] sm:block">
          {actionText}
        </div>
      </div>
    </div>
  );
}
