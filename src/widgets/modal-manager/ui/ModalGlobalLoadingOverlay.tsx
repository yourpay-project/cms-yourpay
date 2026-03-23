import type { FC } from "react";
import { Loader2 } from "lucide-react";
import { useLoadingStore } from "@/shared/lib";

import type { ModalGlobalLoadingOverlayProps } from "./ModalGlobalLoadingOverlay.type";

/**
 * Shows a global centered loader whenever modal global loading state is enabled.
 */
export const ModalGlobalLoadingOverlay: FC<ModalGlobalLoadingOverlayProps> = ({ enabled }) => {
  const globalLoading = useLoadingStore((state) => state.globalLoading);

  if (!enabled || !globalLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35">
      <Loader2 className="h-7 w-7 animate-spin text-primary" />
    </div>
  );
};

