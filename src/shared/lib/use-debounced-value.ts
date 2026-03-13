import { useEffect, useState } from "react";

/**
 * Hook for creating a debounced version of a value.
 *
 * Useful for search inputs that should only trigger network requests
 * after the user stops typing for a short delay.
 *
 * @param value - The raw, rapidly changing value.
 * @param delayMs - Debounce delay in milliseconds.
 * @returns The debounced value that only updates after the delay.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebounced(value);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [value, delayMs]);

  return debounced;
}

