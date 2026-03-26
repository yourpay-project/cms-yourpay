import type { FC } from "react";
import { useMemo } from "react";

import { useCustomerWalletsQuery, type CustomerWalletItem } from "@/entities/user";

import type { UserViewWalletsProps } from "./UserViewWallets.type";

function formatWalletName(wallet: CustomerWalletItem): string {
  const fromFormatted = wallet.formattedName?.trim();
  if (fromFormatted) {
    return fromFormatted;
  }

  const rawType = (wallet.type ?? "").toLowerCase();
  if (rawType === "yourpoin") {
    return "Main Account";
  }
  if (rawType === "yourpoin_parking") {
    return "Parking Wallet";
  }
  if (rawType === "parking") {
    return "Parking Wallet";
  }
  if (rawType === "customer") {
    return "Main Account";
  }

  return "Wallet";
}

function renderWalletField(label: string, value?: string): React.JSX.Element {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="rounded-md border border-border/70 bg-background/40 px-2.5 py-1.5 text-sm text-foreground">
        {value?.trim() || "-"}
      </div>
    </div>
  );
}

function renderWalletCard(wallet: CustomerWalletItem): React.JSX.Element {
  const balance = wallet.formattedBalance ?? (wallet.balance != null ? String(wallet.balance) : undefined);

  return (
    <div key={wallet.id} className="rounded-lg border border-border/70 bg-background/30 p-3">
      <p className="mb-3 text-sm font-semibold text-foreground">{formatWalletName(wallet)}</p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {renderWalletField("Balance", balance)}
        {renderWalletField("Type", wallet.type)}
        {renderWalletField("Currency", wallet.currency)}
      </div>
    </div>
  );
}

/**
 * Read-only modal that displays customer wallets grouped by balance category.
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

  return (
    <div className="-mx-6 -mr-6 max-h-[70vh] overflow-y-auto pb-2 pr-6">
      <div className="space-y-3 px-6">
        {query.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading wallets...</p>
        ) : query.isError ? (
          <p className="text-sm text-destructive">Failed to load wallets.</p>
        ) : (wallets?.length ?? 0) === 0 ? (
          <p className="text-sm text-muted-foreground">No wallets found for this customer.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <section className="rounded-lg border border-border/70 bg-muted/20 p-3">
              <p className="mb-3 text-sm font-semibold text-foreground">Customer Wallets (IDR Balance)</p>
              <div className="space-y-3">
                {idrWallets.length > 0 ? (
                  idrWallets.map((wallet) => renderWalletCard(wallet))
                ) : (
                  <p className="text-sm text-muted-foreground">No IDR wallets.</p>
                )}
              </div>
            </section>

            <section className="rounded-lg border border-border/70 bg-muted/20 p-3">
              <p className="mb-3 text-sm font-semibold text-foreground">Yourpoin Balance</p>
              <div className="space-y-3">
                {yourpoinWallets.length > 0 ? (
                  yourpoinWallets.map((wallet) => renderWalletCard(wallet))
                ) : (
                  <p className="text-sm text-muted-foreground">No Yourpoin wallets.</p>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

