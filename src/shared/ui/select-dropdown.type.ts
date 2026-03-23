/**
 * Single option item used by {@link SelectDropdown}.
 */
export interface SelectDropdownOption {
  value: string;
  label: string;
  description?: string;
}

/**
 * Props for {@link SelectDropdown}.
 */
export interface SelectDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectDropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  allowClear?: boolean;
  size?: "sm" | "md";
  id?: string;
}

