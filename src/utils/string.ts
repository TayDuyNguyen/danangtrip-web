export const cn = (...classes: (string | false | null | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const formatDate = (date: Date | string, locale = "en-US") => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale);
};

export const formatTime = (date: Date | string, locale = "en-US") => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleTimeString(locale);
};

export const formatDateTime = (date: Date | string, locale = "en-US") => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleString(locale);
};

export const truncate = (str: string, length: number, suffix = "...") => {
  return str.length > length ? str.substring(0, length) + suffix : str;
};

export const generateId = () => {
  return Math.random().toString(36).substring(2, 11);
};

export const parseJson = <T>(json: string, fallback?: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback as T;
  }
};

export const isEmpty = (value: any): boolean => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "") ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" && Object.keys(value).length === 0)
  );
};
