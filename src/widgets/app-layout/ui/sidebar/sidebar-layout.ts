export interface SidebarLayoutView {
  width: number;
  dashboardWrapPaddingClass: string;
  dividerMarginClass: string;
  navOuterClass: string;
  navClassName: string;
}

const SIDEBAR_LAYOUT_BY_VIEW: Record<"collapsed" | "expanded", SidebarLayoutView> = {
  collapsed: {
    width: 64,
    dashboardWrapPaddingClass: "px-2",
    dividerMarginClass: "mx-2",
    navOuterClass: "mt-1 mx-0",
    navClassName:
      "flex flex-1 min-h-0 flex-col overflow-y-auto overflow-x-auto gap-1 px-2 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  },
  expanded: {
    width: 256,
    dashboardWrapPaddingClass: "px-1",
    dividerMarginClass: "mx-1",
    navOuterClass: "mt-2 mx-0 pt-2 pb-3",
    navClassName:
      "flex flex-1 min-h-0 flex-col overflow-y-auto overflow-x-auto sidebar-scroll gap-3 px-1 pb-4",
  },
};

/**
 * Resolves layout classes for the sidebar based on collapsed state.
 *
 * @param collapsed - Whether sidebar is in collapsed (icon-only) mode.
 * @returns Layout view configuration for sizing and className strings.
 */
export function getSidebarLayoutView(collapsed: boolean): SidebarLayoutView {
  let key: "collapsed" | "expanded" = "expanded";
  if (collapsed) {
    key = "collapsed";
  }
  return SIDEBAR_LAYOUT_BY_VIEW[key];
}

