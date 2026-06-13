/**
 * Format utilities for dates, numbers, currencies, etc.
 */

// Date formatting
export const formatDate = (date: string | Date, locale: string = "vi-VN"): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTime = (date: string | Date, locale: string = "vi-VN"): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatRelativeTime = (date: string | Date, locale: string = "vi-VN"): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, "second");
  }
  if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
  }
  if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
  }
  if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
  }
  if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), "month");
  }
  return rtf.format(-Math.floor(diffInSeconds / 31536000), "year");
};

// Currency formatting
export const formatCurrency = (
  amount: number | string,
  currency: string = "VND",
  locale: string = "vi-VN"
): string => {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
};

export const formatPriceVND = (price: string | number, locale: string = "vi-VN"): string => {
  const value = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "VND",
  }).format(value);
};

/**
 * Format location price ranges
 */
export const formatLocationPriceRange = (
  priceMin: number | string | null | undefined,
  priceMax: number | string | null | undefined,
  t: (key: string) => string,
  locale: string = "vi-VN"
): { displayPrice: string; isFreeOrUnspecified: boolean } => {
  const minVal = priceMin !== null && priceMin !== undefined && priceMin !== "" ? Number(priceMin) : null;
  const maxVal = priceMax !== null && priceMax !== undefined && priceMax !== "" ? Number(priceMax) : null;

  const isMinUnspecified = minVal === null || isNaN(minVal);
  const isMaxUnspecified = maxVal === null || isNaN(maxVal);

  if (isMinUnspecified && isMaxUnspecified) {
    return { displayPrice: t("price.unspecified"), isFreeOrUnspecified: true };
  }

  // If one of them is 0 and the other is either 0 or unspecified, it is free
  const isMinFree = !isMinUnspecified && minVal === 0;
  const isMaxFree = !isMaxUnspecified && maxVal === 0;

  if ((isMinFree || isMinUnspecified) && (isMaxFree || isMaxUnspecified)) {
    return { displayPrice: t("price.free"), isFreeOrUnspecified: true };
  }

  // If different, show range
  if (!isMinUnspecified && !isMaxUnspecified && minVal !== maxVal) {
    return {
      displayPrice: `${formatPriceVND(minVal, locale)} - ${formatPriceVND(maxVal, locale)}`,
      isFreeOrUnspecified: false,
    };
  }

  // If only min is specified
  if (!isMinUnspecified) {
    if (minVal === 0) {
      return { displayPrice: t("price.free"), isFreeOrUnspecified: true };
    }
    return { displayPrice: formatPriceVND(minVal, locale), isFreeOrUnspecified: false };
  }

  // If only max is specified
  if (!isMaxUnspecified) {
    if (maxVal === 0) {
      return { displayPrice: t("price.free"), isFreeOrUnspecified: true };
    }
    return { displayPrice: formatPriceVND(maxVal, locale), isFreeOrUnspecified: false };
  }

  return { displayPrice: t("price.unspecified"), isFreeOrUnspecified: true };
};


// Number formatting
export const formatNumber = (num: number, locale: string = "vi-VN"): string => {
  return new Intl.NumberFormat(locale).format(num);
};

export const formatCompactNumber = (num: number, locale: string = "vi-VN"): string => {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
  }).format(num);
};

// Percentage formatting
export const formatPercent = (num: number, locale: string = "vi-VN", decimals: number = 1): string => {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num / 100);
};

// Phone number formatting
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  return phone;
};

// File size formatting
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// String formatting utilities
export const capitalize = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const camelCase = (str: string): string => {
  return str
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (_, char) => char.toLowerCase());
};

export const snakeCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "");
};

export const kebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
};

/**
 * Formats a raw number to a price string with thousands dot separator for input fields
 */
export const formatInputPrice = (value: number | undefined): string => {
  if (value === undefined || value === null) return "";
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

/**
 * Parses a formatted price string back to a raw number
 */
export const parseInputPrice = (displayValue: string): number | undefined => {
  const clean = displayValue.replace(/\D/g, "");
  if (!clean) return undefined;
  return Number(clean);
};
