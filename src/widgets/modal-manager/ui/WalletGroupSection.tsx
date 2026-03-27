import type { FC } from "react";

import type { CustomerWalletItem } from "@/entities/user";

import { WalletCard } from "./WalletCard";

export interface WalletGroupSectionProps {
  title: string;
  emptyMessage: string;
  wallets: CustomerWalletItem[];
}

/**
 * Wallet group section with title and list/empty state.
 *
 * @param props Group title, empty text, and wallets list.
 * @returns Grouped wallet section block.
 */
export const WalletGroupSection: FC<WalletGroupSectionProps> = ({
  title,
  emptyMessage,
  wallets,
}) => {
  if (wallets.length === 0) {
    return (
      <section className="rounded-lg border border-border/70 bg-muted/20 p-3">
        <p className="mb-3 text-sm font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-border/70 bg-muted/20 p-3">
      <p className="mb-3 text-sm font-semibold text-foreground">{title}</p>
      <div className="space-y-3">
        {wallets.map((wallet) => (
          <WalletCard key={wallet.id} wallet={wallet} />
        ))}
      </div>
    </section>
  );
};
