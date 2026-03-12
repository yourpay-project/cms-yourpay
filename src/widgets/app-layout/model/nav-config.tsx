import { navGroups as baseNavGroups } from '@/shared/config';

import type { NavGroupConfig } from './nav-types';
import { navIcons } from './nav-icons';

const iconByKey: Record<string, JSX.Element> = navIcons as unknown as Record<
  string,
  JSX.Element
>;

/**
 * UI-ready navigation groups for the sidebar (with ReactNode icons).
 *
 * The underlying navigation data lives in `shared/config` so higher layers
 * (like the app router) can consume it without depending on widgets.
 */
export const navGroups: NavGroupConfig[] = baseNavGroups.map((group) => ({
  group: group.group,
  items: group.items.map((item) => ({
    to: item.to,
    label: item.label,
    permission: item.permission,
    icon: item.iconKey ? iconByKey[item.iconKey] : undefined,
  })),
}));

