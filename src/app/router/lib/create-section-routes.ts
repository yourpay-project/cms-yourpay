import type { AnyRoute } from '@tanstack/react-router';
import { createRoute } from '@tanstack/react-router';

import type { NavigationGroupConfig } from '@/shared/config';

/**
 * Builds sidebar-driven section routes from the global `navGroups` config.
 *
 * @param rootRoute - Parent route for all generated routes.
 * @param navGroups - Navigation config groups (UI-agnostic, from shared/config).
 * @param customersComponent - Component used for `/customers`.
 * @param sectionComponent - Fallback component used for other sections.
 * @returns An array of TanStack Route objects to attach to the route tree.
 */
export function createSectionRoutes<TRoot extends AnyRoute>(params: {
  rootRoute: TRoot;
  navGroups: NavigationGroupConfig[];
  customersComponent: Parameters<typeof createRoute>[0]['component'];
  sectionComponent: Parameters<typeof createRoute>[0]['component'];
}): AnyRoute[] {
  const { rootRoute, navGroups, customersComponent, sectionComponent } = params;

  return navGroups
    .flatMap((group) => group.items)
    .filter((item) => item.to !== '/')
    .map((item) =>
      createRoute({
        getParentRoute: () => rootRoute,
        path: item.to,
        component: item.to === '/customers' ? customersComponent : sectionComponent,
      }),
    );
}

