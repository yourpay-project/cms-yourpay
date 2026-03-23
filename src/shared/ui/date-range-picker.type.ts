/**
 * Controlled date range value used by {@link DateRangePicker}.
 */
export interface DateRangeValue {
  from: string;
  to: string;
}

/**
 * Preset shortcut rendered inside {@link DateRangePicker}.
 */
export interface DateRangePickerPreset {
  label: string;
  getRange: () => DateRangeValue;
}

/**
 * Props for {@link DateRangePicker}.
 */
export interface DateRangePickerProps {
  /** Field label rendered above the trigger. */
  label: string;
  /** Controlled `from` value in `yyyy-MM-dd` format; pass `""` to clear. */
  from: string;
  /** Controlled `to` value in `yyyy-MM-dd` format; pass `""` to clear. */
  to: string;
  /** Optional label for currently selected preset (e.g. "Last 30 days"). */
  presetLabel?: string | null;
  /** Optional preset shortcuts. When provided, they are rendered above the custom calendar. */
  presets?: readonly DateRangePickerPreset[];
  /** Called when the user applies a preset or custom range. */
  onRangeChange: (from: string, to: string, presetLabel?: string) => void;
  /** Wrapper class override. */
  className?: string;
  /** Placeholder text when no value is selected. */
  placeholder?: string;
  /** Show clear (X) button next to the trigger when a full range is selected. */
  allowClear?: boolean;
  disabled?: boolean;
}

