"use client";

import { useId } from "react";
import { UilSearch } from "@iconscout/react-unicons";
import { cn } from "@/utils/string";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
  /** Accessible name when no visible label is provided */
  "aria-label"?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder,
  isLoading,
  className,
  "aria-label": ariaLabel,
}: SearchInputProps) {
  const autoId = useId();
  const inputId = `search-input-${autoId.replace(/:/g, "")}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
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

      <div className="relative z-10 bg-surface-container-low/70 backdrop-blur-md border border-border group-focus-within:border-primary w-full h-full flex items-center rounded-xl overflow-hidden m-px">
        <UilSearch
          size={20}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors duration-300 pointer-events-none"
          aria-hidden
        />
        <input
          id={inputId}
          type="search"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          aria-label={ariaLabel ?? placeholder ?? "Search"}
          className="w-full bg-transparent border-none py-4 pl-12 pr-6 text-base font-semibold placeholder:text-on-surface-variant/40 focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none"
        />
      </div>
    </div>
  );
}
