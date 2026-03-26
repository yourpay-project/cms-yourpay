import type { FC } from "react";

export interface WalletStateMessageProps {
  message: string;
  className: string;
}

/**
 * Shared state-message layout for wallet modal states.
 *
 * @param props Message text and semantic class name.
 * @returns Scrollable state message container.
 */
export const WalletStateMessage: FC<WalletStateMessageProps> = ({ message, className }) => {
  return (
    <div className="-mx-6 -mr-6 max-h-[70vh] overflow-y-auto pb-2 pr-6">
      <div className="space-y-3 px-6">
        <p className={className}>{message}</p>
      </div>
    </div>
  );
};
