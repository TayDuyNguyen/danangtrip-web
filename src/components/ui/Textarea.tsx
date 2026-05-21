"use client";
import React, {
  type TextareaHTMLAttributes,
  useId,
} from "react";
import { cn } from "@/utils/string";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isFocused?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      isFocused = false,
      id: idProp,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const textareaId = idProp ?? `textarea-${autoId.replace(/:/g, "")}`;

    return (
      <div className={cn("w-full group", className)}>
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              "block text-[11px] font-bold mb-1 uppercase tracking-[0.2em] transition-all duration-300 transform",
              isFocused || error
                ? "translate-y-0 opacity-100"
                : "text-transparent -translate-y-1 opacity-0",
              isFocused ? "text-primary" : (error ? "text-red-400" : "")
            )}
          >
            {label}
          </label>
        )}

        {/* Textarea container */}
        <div
          className={cn(
            "flex border-b px-0 transition-all duration-300 ease-out",
            error
              ? "border-red-500"
              : isFocused
                ? "border-primary"
                : "border-border",
            "bg-transparent"
          )}
        >
          {/* Textarea field */}
          <textarea
            ref={ref}
            id={textareaId}
            rows={rows}
            suppressHydrationWarning
            className={cn(
              "w-full py-3 bg-transparent outline-none placeholder:text-on-surface-variant",
              "transition-all duration-300 focus:placeholder-transparent",
              "text-sm sm:text-base text-white font-medium resize-none"
            )}
            {...props}
          />
        </div>

        {/* Error message */}
        <div className="h-5 overflow-hidden">
          {error && (
            <p className="mt-1 text-xs text-red-500 animate-in fade-in slide-in-from-top-1 duration-300">
              {error}
            </p>
          )}
        </div>

        {/* Helper text */}
        {helperText && !error && (
          <p className="text-on-surface-variant text-sm mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
