import type { Location, LocationOpeningHoursMap } from '@/types';

const WEEK_ORDER: (keyof LocationOpeningHoursMap)[] = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
];

export type OpeningHoursDisplay =
  | { kind: 'plain'; text: string }
  | { kind: 'week'; rows: { dayKey: keyof LocationOpeningHoursMap; hours: string }[] };

function parseOpeningHours(val: unknown): string | string[] | Record<string, string> | undefined {
  if (!val) return undefined;
  if (Array.isArray(val)) {
    if (val.length === 1 && typeof val[0] === 'string') {
      const innerStr = val[0].trim();
      if (innerStr.startsWith('[') && innerStr.endsWith(']')) {
        try {
          return parseOpeningHours(JSON.parse(innerStr));
        } catch {
          // Fallback
        }
      }
    }
    const items = val.map((item) => String(item).trim()).filter(Boolean);
    return items.length > 0 ? items : undefined;
  }
  if (typeof val === 'object' && !Array.isArray(val)) return val as Record<string, string>;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed === '') return undefined;
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        return parseOpeningHours(JSON.parse(trimmed));
      } catch {
        return trimmed;
      }
    }
    return trimmed;
  }
  return undefined;
}

export function normalizeOpeningHoursDisplay(raw: Location['opening_hours']): OpeningHoursDisplay | null {
  const parsed = parseOpeningHours(raw);
  if (!parsed) {
    return null;
  }

  if (typeof parsed === 'string') {
    return { kind: 'plain', text: parsed };
  }

  if (Array.isArray(parsed)) {
    return { kind: 'plain', text: parsed.join('\n') };
  }

    const rows: { dayKey: keyof LocationOpeningHoursMap; hours: string }[] = [];
  for (const day of WEEK_ORDER) {
    const hours = (parsed as Record<string, string>)[day];
    if (typeof hours === 'string' && hours.trim() !== '') {
      rows.push({ dayKey: day, hours: hours.trim() });
    }
  }

  if (rows.length === 0) {
    return null;
  }

  return { kind: 'week', rows };
}
