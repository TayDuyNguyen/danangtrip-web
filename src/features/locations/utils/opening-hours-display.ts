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

export function normalizeOpeningHoursDisplay(raw: Location['opening_hours']): OpeningHoursDisplay | null {
  if (raw == null || raw === '') {
    return null;
  }

  if (typeof raw === 'string') {
    return { kind: 'plain', text: raw };
  }

  if (typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }

  const rows: { dayKey: keyof LocationOpeningHoursMap; hours: string }[] = [];
  for (const day of WEEK_ORDER) {
    const hours = raw[day];
    if (typeof hours === 'string' && hours.trim() !== '') {
      rows.push({ dayKey: day, hours: hours.trim() });
    }
  }

  if (rows.length === 0) {
    return null;
  }

  return { kind: 'week', rows };
}
