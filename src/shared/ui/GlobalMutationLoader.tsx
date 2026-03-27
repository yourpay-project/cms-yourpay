import type { FC } from "react";
import { useIsMutating } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

/**
 * Global full-screen loader for active TanStack Query mutations.
 *
 * @returns Full-screen loader node when mutations are pending, otherwise `null`.
 */
export const GlobalMutationLoader: FC = () => {
  const isMutating = useIsMutating();

  if (isMutating === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2 rounded-md border border-border bg-background p-4 shadow-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-foreground">Memproses data...</p>
      </div>
    </div>
  );
};
