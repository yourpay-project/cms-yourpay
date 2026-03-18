import { useCallback, useState } from "react";

export interface UseLazyModalResult {
  isOpen: boolean;
  isMounted: boolean;
  openModal: () => void;
  closeModal: () => void;
  setOpen: (nextOpen: boolean) => void;
}

/**
 * Controls modal visibility while keeping lazy-loaded modal mounted
 * after first open so subsequent open/close animations remain smooth.
 *
 * @returns Lazy modal state and handlers.
 */
export function useLazyModal(): UseLazyModalResult {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const openModal = useCallback(() => {
    setIsMounted(true);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const setOpen = useCallback((nextOpen: boolean) => {
    if (nextOpen) {
      setIsMounted(true);
    }
    setIsOpen(nextOpen);
  }, []);

  return {
    isOpen,
    isMounted,
    openModal,
    closeModal,
    setOpen,
  };
}
