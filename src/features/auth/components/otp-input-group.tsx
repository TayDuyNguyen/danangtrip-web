"use client";

import { useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";

interface OtpInputGroupProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
}

export function OtpInputGroup({
  value,
  onChange,
  error = false,
  disabled = false,
}: OtpInputGroupProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Split value into array of 6 characters
  const digits = value.split("").slice(0, 6);
  while (digits.length < 6) {
    digits.push("");
  }

  // Focus the first empty input or the last input if all are filled
  useEffect(() => {
    if (disabled) return;
    
    const firstEmptyIndex = digits.findIndex((d) => d === "");
    const focusIndex = firstEmptyIndex !== -1 ? firstEmptyIndex : 5;
    
    // Check if another element is already focused to avoid grabbing focus unexpectedly
    const activeElement = document.activeElement;
    const isOtpFocused = inputsRef.current.some((el) => el === activeElement);
    
    if (isOtpFocused && inputsRef.current[focusIndex]) {
      inputsRef.current[focusIndex]?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, disabled]);

  const handleInputChange = (index: number, val: string) => {
    // Only allow digits
    const cleanedVal = val.replace(/\D/g, "");
    if (!cleanedVal) {
      // If cleared, update value
      const newDigits = [...digits];
      newDigits[index] = "";
      onChange(newDigits.join("").slice(0, 6));
      return;
    }

    // Take only the last character if multiple characters were entered somehow
    const singleChar = cleanedVal.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = singleChar;
    
    const newValue = newDigits.join("").slice(0, 6);
    onChange(newValue);

    // Auto-focus next input if not at the end
    if (singleChar && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      // If current field is empty, delete previous field value and move focus back
      if (!digits[index] && index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        onChange(newDigits.join("").slice(0, 6));
        inputsRef.current[index - 1]?.focus();
        e.preventDefault();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
      e.preventDefault();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
      e.preventDefault();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    const pastedText = e.clipboardData.getData("text");
    const cleanedText = pastedText.replace(/\D/g, "").slice(0, 6);

    if (cleanedText.length > 0) {
      onChange(cleanedText);
      // Focus the appropriate input
      const nextFocusIndex = cleanedText.length < 6 ? cleanedText.length : 5;
      inputsRef.current[nextFocusIndex]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3" dir="ltr">
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[index]}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold bg-[#030303] text-white border rounded-lg focus:outline-none transition-all duration-200 selection:bg-transparent ${
            error
              ? "border-[#ef4444] focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444]/30"
              : "border-[#262626] focus:border-[#8b6a55] focus:ring-1 focus:ring-[#8b6a55]/30"
          } disabled:opacity-40 disabled:cursor-not-allowed`}
          aria-label={`OTP Digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
