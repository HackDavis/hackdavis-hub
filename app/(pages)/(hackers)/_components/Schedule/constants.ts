export const DAY_KEYS = ['9', '10'] as const;

export type DayKey = (typeof DAY_KEYS)[number];

export const DAY_LABELS: Record<DayKey, string> = {
  '9': 'MAY 9',
  '10': 'MAY 10',
};
