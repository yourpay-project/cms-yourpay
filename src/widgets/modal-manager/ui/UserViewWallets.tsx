import type { FC } from "react";
import { useMemo } from "react";

import { useCustomerWalletsQuery } from "@/entities/user";

import type { UserViewWalletsProps } from "./UserViewWallets.type";
import { WalletGroupSection } from "./WalletGroupSection";
import { WalletStateMessage } from "./WalletStateMessage";

/**
 * Read-only modal that displays customer wallets grouped by balance category.
 *
 * @param props Modal open state and selected customer id.
 * @returns Wallet sections for loading, error, empty, or success states.
 */
export const UserViewWallets: FC<UserViewWalletsProps> = ({
  open,
  customerId,
}) => {
  const query = useCustomerWalletsQuery({
    customerId,
    enabled: open,
  });

  const wallets = query.data;

  const { idrWallets, yourpoinWallets } = useMemo(() => {
    const items = wallets ?? [];
    return {
      idrWallets: items.filter((wallet) => (wallet.currency ?? "").toUpperCase() === "IDR"),
      yourpoinWallets: items.filter((wallet) => (wallet.currency ?? "").toUpperCase() !== "IDR"),
    };
  }, [wallets]);

  if (query.isLoading) {
    return (
      <WalletStateMessage
        message="Loading wallets..."
        className="text-sm text-muted-foreground"
      />
    );
  }
  if (query.isError) {
    return (
      <WalletStateMessage
        message="Failed to load wallets."
        className="text-sm text-destructive"
      />
    );
  }
  if ((wallets?.length ?? 0) === 0) {
    return (
      <WalletStateMessage
        message="No wallets found for this customer."
        className="text-sm text-muted-foreground"
      />
    );
  }

  return (
    <div className="-mx-6 -mr-6 max-h-[70vh] overflow-y-auto pb-2 pr-6">
      <div className="space-y-3 px-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <WalletGroupSection
            title="Customer Wallets (IDR Balance)"
            emptyMessage="No IDR wallets."
            wallets={idrWallets}
          />
          <WalletGroupSection
            title="Yourpoin Balance"
            emptyMessage="No Yourpoin wallets."
            wallets={yourpoinWallets}
          />
        </div>
      </div>
    </div>
  );
};

