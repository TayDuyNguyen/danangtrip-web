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
      "relative group flex-1 w-full rounded-xl transition-all duration-300 overflow-hidden",
      isLoading ? "ring-2 ring-[#8b6a55] ring-offset-2 ring-offset-background" : "",
      className
    )}>
      {/* Animated Border Beam */}
      {isLoading && (
        <div className="absolute inset-0 z-0 overflow-hidden rounded-xl">
          <div className="absolute -inset-full animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,#8b6a55_360deg)]" />
        </div>
      )}

      <div className="relative z-10 bg-surface-container-low/70 backdrop-blur-md border border-[#262626] group-focus-within:border-[#8b6a55] w-full h-full flex items-center rounded-xl overflow-hidden m-px">
        <IoSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-on-surface-variant/50 group-focus-within:text-[#8b6a55] transition-colors duration-300" />
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-transparent border-none py-4 pl-12 pr-6 text-base font-semibold placeholder:text-on-surface-variant/40 focus:ring-4 focus:ring-[#8b6a55]/10 transition-all duration-300 outline-none"
        />
      </div>
    </div>
  );
}
