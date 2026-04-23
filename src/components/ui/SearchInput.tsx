"use client";

import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { cn } from "@/utils/string";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

export default function SearchInput({ 
  value, 
  onChange, 
  placeholder, 
  isLoading, 
  className 
}: SearchInputProps) {
  const [prevValue, setPrevValue] = useState(value);
  const [inputValue, setInputValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setInputValue(value);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
  };

  return (
    <div className={cn(
      "relative group flex-1 w-full rounded-[32px] transition-all duration-500 overflow-hidden",
      isLoading ? "ring-2 ring-azure ring-offset-2 ring-offset-background" : "",
      className
    )}>
      {/* Animated Border Beam */}
      {isLoading && (
        <div className="absolute inset-0 z-0 overflow-hidden rounded-[32px]">
          <div className="absolute -inset-full animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,var(--color-azure)_360deg)]" />
        </div>
      )}

      <div className="relative z-10 bg-surface-container-low/40 backdrop-blur-md border-2 border-outline-variant/10 group-focus-within:border-azure/30 w-full h-full flex items-center rounded-[32px] overflow-hidden m-[2px]">
        <IoSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-2xl text-on-surface-variant/50 group-focus-within:text-azure transition-colors duration-500" />
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-transparent border-none py-7 pl-16 pr-8 text-xl font-bold placeholder:text-on-surface-variant/30 focus:ring-8 focus:ring-azure/5 transition-all duration-500 outline-none"
        />
      </div>
    </div>
  );
}
