import type { FC } from "react";
import { Button } from "@/shared/ui";
import { GoogleIcon } from "./GoogleIcon";

interface LoginFormFooterActionProps {
  isPending: boolean;
  onGoogleClick: () => void;
}

/**
 * Footer action section (Google sign-in button).
 */
export const LoginFormFooterAction: FC<LoginFormFooterActionProps> = ({
  isPending,
  onGoogleClick,
}) => {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full gap-3 border-border bg-background hover:bg-accent"
      onClick={onGoogleClick}
      disabled={isPending}
    >
      <GoogleIcon className="h-5 w-5" />
      Sign in with Google
    </Button>
  );
};

