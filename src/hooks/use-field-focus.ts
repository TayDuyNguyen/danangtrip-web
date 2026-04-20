"use client";

import { useState, useCallback } from "react";

/**
 * Hook to manage focus state for multiple fields in a form.
 *
 * @example
 * const { isFocused, getFocusProps } = useFieldFocus<'email' | 'password'>();
 *
 * <Input isFocused={isFocused('email')} {...getFocusProps('email')} />
 */
export function useFieldFocus<T extends string>() {
  const [focusedField, setFocusedField] = useState<T | null>(null);

  const isFocused = useCallback(
    (field: T) => focusedField === field,
    [focusedField]
  );

  /**
   * Returns onFocus and onBlur handlers for a specific field.
   * Can be passed directly to the props of an Input component.
   */
  const getFocusProps = useCallback(
    (field: T) => ({
      onFocus: () => setFocusedField(field),
      onBlur: (e: React.FocusEvent<HTMLElement>) => {
        const nextFocused = e.relatedTarget as HTMLElement | null;
        // Only clear focus if it actually leaves the input field tracking
        if (!nextFocused?.closest("[data-form-field]")) {
          setFocusedField((prev) => (prev === field ? null : prev));
        }
      },
    }),
    []
  );

  return { focusedField, isFocused, getFocusProps };
}
