/**
 * Props for {@link Sidebar}.
 */
export interface SidebarProps {
  className?: string;
  /**
   * When true, sidebar is forced expanded (labels visible, full width),
   * ignoring the persisted `collapsed` state. Used for the mobile overlay
   * so navigation is always readable even if desktop sidebar is collapsed.
   */
  forceExpanded?: boolean;
}

