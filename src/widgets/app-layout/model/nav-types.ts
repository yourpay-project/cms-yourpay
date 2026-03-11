import type { ReactNode } from "react";

export interface NavItemConfig {
  to: string;
  label: string;
  icon?: ReactNode;
  permission?: string;
}

export interface NavGroupConfig {
  group?: string;
  items: NavItemConfig[];
}

