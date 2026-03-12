import { useEffect } from 'react';

import { useLoadingStore } from './loading-store';

/**
 * Syncs a loading flag to the global loading store (shown in Nav).
 * Use for the main "initial data" query of a page so the nav shows the spinner
 * during first load. Clears global loading on unmount.
 *
 * @param loading - Typically `isLoading` from TanStack Query (true only when no data yet).
 */
export function useSyncGlobalLoading(loading: boolean): void {
  const setGlobalLoading = useLoadingStore((s) => s.setGlobalLoading);

  useEffect(() => {
    setGlobalLoading(loading);
    return () => setGlobalLoading(false);
  }, [loading, setGlobalLoading]);
}
