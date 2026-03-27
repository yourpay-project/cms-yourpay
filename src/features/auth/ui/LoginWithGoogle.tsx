import type { FC } from "react";

import { Button } from "@/shared/ui";

import { GoogleIcon } from "./GoogleIcon";

interface LoginWithGoogleProps {
  isLoading: boolean;
  onGoogleClick: () => void;
}

/**
 * Google login action section.
 *
 * @param props - Action handler and loading state.
 * @returns Google sign-in button.
 */
export const LoginWithGoogle: FC<LoginWithGoogleProps> = ({ isLoading, onGoogleClick }) => {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full gap-3 border-border bg-background hover:bg-accent"
      onClick={onGoogleClick}
      disabled={isLoading}
    >
      <GoogleIcon className="h-5 w-5" />
      Sign in with Google
    </Button>
  );
};
