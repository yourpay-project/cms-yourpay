/**
 * Props for {@link DatePicker}.
 */
export interface DatePickerProps {
  /** Field label rendered above the trigger. */
  label: string;
  /** Controlled selected value in `yyyy-MM-dd` format; pass `""` to clear. */
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;
  /** Optional format applied for the visible trigger text. Defaults to the raw `value`. */
  displayFormat?: string;
}

