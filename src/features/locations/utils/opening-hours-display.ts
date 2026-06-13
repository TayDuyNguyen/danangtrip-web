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

function parseLinesToWeek(lines: string[]): OpeningHoursDisplay | null {
  const dayMap: Record<string, keyof LocationOpeningHoursMap> = {
    mon: 'mon', monday: 'mon', 'thứ hai': 'mon', 'thứ 2': 'mon', t2: 'mon',
    tue: 'tue', tuesday: 'tue', 'thứ ba': 'tue', 'thứ 3': 'tue', t3: 'tue',
    wed: 'wed', wednesday: 'wed', 'thứ tư': 'wed', 'thứ 4': 'wed', t4: 'wed',
    thu: 'thu', thursday: 'thu', 'thứ năm': 'thu', 'thứ 5': 'thu', t5: 'thu',
    fri: 'fri', friday: 'fri', 'thứ sáu': 'fri', 'thứ 6': 'fri', t6: 'fri',
    sat: 'sat', saturday: 'sat', 'thứ bảy': 'sat', 'thứ 7': 'sat', t7: 'sat',
    sun: 'sun', sunday: 'sun', 'chủ nhật': 'sun', cn: 'sun'
  };

  const rows: { dayKey: keyof LocationOpeningHoursMap; hours: string }[] = [];
  const seenDays = new Set<string>();

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = trimmed.match(/^([^:\-]+)[:\-](.*)$/);
    if (!match) return null;

    const rawDay = match[1].trim().toLowerCase();
    const hours = match[2].trim();

    const dayKey = dayMap[rawDay];
    if (!dayKey || seenDays.has(dayKey)) {
      return null;
    }

    seenDays.add(dayKey);
    rows.push({ dayKey, hours });
  }

  if (rows.length === 0) return null;

  rows.sort((a, b) => WEEK_ORDER.indexOf(a.dayKey) - WEEK_ORDER.indexOf(b.dayKey));

  return { kind: 'week', rows };
}

export function normalizeOpeningHoursDisplay(raw: Location['opening_hours']): OpeningHoursDisplay | null {
  const parsed = parseOpeningHours(raw);
  if (!parsed) {
    return null;
  }

  if (typeof parsed === 'string') {
    const lines = parsed.split('\n').map(l => l.trim()).filter(Boolean);
    const weekDisplay = parseLinesToWeek(lines);
    if (weekDisplay) return weekDisplay;
    return { kind: 'plain', text: parsed };
  }

  if (Array.isArray(parsed)) {
    const weekDisplay = parseLinesToWeek(parsed);
    if (weekDisplay) return weekDisplay;
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
