import type { FC } from "react";

import { LoginFormThemeTabs } from "./LoginFormThemeTabs";

interface LoginFooterProps {
  appVersion: string;
}

/**
 * Bottom footer section for login card.
 *
 * @param props - App version metadata.
 * @returns Centered theme switch and legal/version texts.
 */
export const LoginFooter: FC<LoginFooterProps> = ({ appVersion }) => {
  return (
    <div className="space-y-4 mt-16">
      <div className="flex justify-center">
        <LoginFormThemeTabs />
      </div>
      <div className="space-y-1 text-center">
        <p className="text-xs text-muted-foreground">PT Rpay Finansial Digital Indonesia</p>
        <p className="text-xs font-semibold text-muted-foreground">Version {appVersion}</p>
      </div>
    </div>
  );
};
