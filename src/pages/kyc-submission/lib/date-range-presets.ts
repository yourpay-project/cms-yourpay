/**
 * Date range preset helpers and "Last 30 days" initial for KYC filters.
 * Used by DateRangePickerWithPresets and useKycSubmissionFilters.
 */

export interface DateRangeValue {
  from: string;
  to: string;
}

function toYYYYMMDD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfDay(d: Date): Date {
  const o = new Date(d);
  o.setHours(0, 0, 0, 0);
  return o;
}

function endOfDay(d: Date): Date {
  const o = new Date(d);
  o.setHours(23, 59, 59, 999);
  return o;
}

/** Returns initial range and label for "Last 30 days" (for default filter state). */
export function getLast30DaysInitial(): { from: string; to: string; presetLabel: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 29);
  return {
    from: toYYYYMMDD(startOfDay(start)),
    to: toYYYYMMDD(endOfDay(end)),
    presetLabel: "Last 30 days",
  };
}

export const PRESETS: { label: string; getRange: () => DateRangeValue }[] = [
  {
    label: "Today",
    getRange: () => {
      const t = new Date();
      return { from: toYYYYMMDD(startOfDay(t)), to: toYYYYMMDD(endOfDay(t)) };
    },
  },
  {
    label: "Yesterday",
    getRange: () => {
      const t = new Date();
      t.setDate(t.getDate() - 1);
      return { from: toYYYYMMDD(startOfDay(t)), to: toYYYYMMDD(endOfDay(t)) };
    },
  },
  {
    label: "Last 7 days",
    getRange: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 6);
      return { from: toYYYYMMDD(startOfDay(start)), to: toYYYYMMDD(endOfDay(end)) };
    },
  },
  {
    label: "Last 30 days",
    getRange: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 29);
      return { from: toYYYYMMDD(startOfDay(start)), to: toYYYYMMDD(endOfDay(end)) };
    },
  },
  {
    label: "This month",
    getRange: () => {
      const t = new Date();
      const start = new Date(t.getFullYear(), t.getMonth(), 1);
      const end = new Date(t.getFullYear(), t.getMonth() + 1, 0);
      return { from: toYYYYMMDD(start), to: toYYYYMMDD(end) };
    },
  },
  {
    label: "Last month",
    getRange: () => {
      const t = new Date();
      const start = new Date(t.getFullYear(), t.getMonth() - 1, 1);
      const end = new Date(t.getFullYear(), t.getMonth(), 0);
      return { from: toYYYYMMDD(start), to: toYYYYMMDD(end) };
    },
  },
  {
    label: "This year",
    getRange: () => {
      const t = new Date();
      const start = new Date(t.getFullYear(), 0, 1);
      const end = new Date(t.getFullYear(), 11, 31);
      return { from: toYYYYMMDD(start), to: toYYYYMMDD(end) };
    },
  },
];
