import type { AnyRoute } from '@tanstack/react-router';
import { createRoute } from '@tanstack/react-router';

import type { NavigationGroupConfig } from '@/shared/config';

type RouteComponent = Parameters<typeof createRoute>[0]['component'];

/**
 * Builds sidebar-driven section routes from the global `navGroups` config.
 *
 * @param rootRoute - Parent route for all generated routes.
 * @param navGroups - Navigation config groups (UI-agnostic, from shared/config).
 * @param customersComponent - Component used for `/customers`.
 * @param sectionComponent - Fallback component used for other sections.
 * @param sectionOverrides - Optional map of path -> component for specific sections (e.g. /kyc-submission).
 * @returns An array of TanStack Route objects to attach to the route tree.
 */
export function createSectionRoutes<TRoot extends AnyRoute>(params: {
  rootRoute: TRoot;
  navGroups: NavigationGroupConfig[];
  customersComponent: RouteComponent;
  sectionComponent: RouteComponent;
  sectionOverrides?: Partial<Record<string, RouteComponent>>;
}): AnyRoute[] {
  const { rootRoute, navGroups, customersComponent, sectionComponent, sectionOverrides = {} } = params;

  return navGroups
    .flatMap((group) => group.items)
    .filter((item) => item.to !== '/')
    .map((item) => {
      const component =
        sectionOverrides[item.to] ??
        (item.to === '/customers' ? customersComponent : sectionComponent);
      return createRoute({
        getParentRoute: () => rootRoute,
        path: item.to,
        component,
      });
    });
}

