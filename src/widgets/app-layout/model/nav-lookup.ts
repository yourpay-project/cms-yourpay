import { navGroups } from "./nav-config";
import type { NavItemConfig } from "./nav-types";

const navItemByPath: ReadonlyMap<string, NavItemConfig> = new Map(
  navGroups.flatMap((group) => group.items).map((item) => [item.to, item])
);

export const getNavTitle = (pathname: string): string =>
  navItemByPath.get(pathname)?.label ?? "YourPay CMS";

