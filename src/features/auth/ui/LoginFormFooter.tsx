import type { FC } from "react";
import { LoginFormFooterAction } from "./LoginFormFooterAction";
import { LoginFormFooterNotice } from "./LoginFormFooterNotice";

interface LoginFormFooterProps {
  isPending: boolean;
  onGoogleClick: () => void;
}

/**
 * Footer container for login actions and notice.
 *
 * @param props - {@link LoginFormFooterProps}
 * @returns Login footer section (Google button + notice).
 */
export const LoginFormFooter: FC<LoginFormFooterProps> = ({
  isPending,
  onGoogleClick,
}) => {
  return (
    <div className="space-y-4">
      <LoginFormFooterAction isPending={isPending} onGoogleClick={onGoogleClick} />
      <LoginFormFooterNotice />
    </div>
  );
};

