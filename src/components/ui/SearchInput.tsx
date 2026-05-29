"use client";

import { useId, useEffect, useRef, useState, useMemo } from "react";
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
  /** Accessible name when no visible label is provided */
  "aria-label"?: string;
  /** Debounce delay in ms. Defaults to 500. Set to 0 to disable built-in debounce. */
  debounceMs?: number;
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
}: SearchInputProps) {
  const autoId = useId();
  const inputId = `search-input-${autoId.replace(/:/g, "")}`;

  const [localValue, setLocalValue] = useState(value);
  const lastRef = useRef(value);

  // Sync external value with local state ONLY if it changed externally (e.g. cleared or updated from elsewhere)
  useEffect(() => {
    if (value !== lastRef.current) {
      setLocalValue(value);
      lastRef.current = value;
    }
  }, [value]);

  // Create a memoized debounced onChange callback
  const debouncedOnChange = useMemo(() => {
    if (debounceMs === 0) {
      return null;
    }
    // eslint-disable-next-line react-hooks/refs
    return debounce((val: string) => {
      lastRef.current = val;
      onChange(val);
    }, debounceMs);
  }, [onChange, debounceMs]);

  // Clean up debounce on unmount
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
      lastRef.current = val;
      onChange(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (debouncedOnChange) {
        debouncedOnChange.cancel();
      }
      lastRef.current = localValue;
      onChange(localValue);
    }

    onKeyDown?.(e);
  };

  return (
    <div
      className={cn(
        "relative group flex-1 w-full rounded-xl transition-all duration-300 overflow-hidden",
        isLoading ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "",
        className
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 z-0 overflow-hidden rounded-xl">
          <div className="absolute -inset-full animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,#8b6a55_360deg)] motion-reduce:animate-none" />
        </div>
      )}

      <div className="relative z-10 flex h-full w-full items-center overflow-hidden rounded-xl border border-[#262626] bg-[rgba(14,14,14,0.92)] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] backdrop-blur-md transition-all duration-300 group-hover:border-[#3a2e28] group-focus-within:border-[#8b6a55]/70 group-focus-within:bg-[rgba(19,19,19,0.98)] m-px">
        <UilSearch
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#b58c72] group-focus-within:text-[#f0ccb6] transition-colors duration-300"
          aria-hidden
        />
        <input
          id={inputId}
          type="search"
          value={localValue}
          onChange={handleChange}
          onFocus={onFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={ariaLabel ?? placeholder ?? "Search"}
          className="w-full border-none bg-transparent py-3.5 pl-11 pr-5 text-sm font-medium text-[#f3efec] placeholder:text-[#9d9088] focus:ring-0 transition-all duration-300 outline-none"
        />
      </div>

    </div>
  );
}
