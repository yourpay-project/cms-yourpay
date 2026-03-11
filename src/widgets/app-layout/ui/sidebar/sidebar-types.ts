import type { navGroups } from "../../model/nav-config";

export type SidebarNavItem = (typeof navGroups)[number]["items"][number];

