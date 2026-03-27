import type { FC } from "react";

import type { CustomerWalletItem } from "@/entities/user";

interface WalletCardProps {
  wallet: CustomerWalletItem;
}

function formatWalletName(wallet: CustomerWalletItem): string {
  const fromFormatted = wallet.formattedName?.trim();
  if (fromFormatted) {
    return fromFormatted;
  }

  const rawType = (wallet.type ?? "").toLowerCase();
  if (rawType === "yourpoin" || rawType === "customer") {
    return "Main Account";
  }
  if (rawType === "yourpoin_parking" || rawType === "parking") {
    return "Parking Wallet";
  }

  return "Wallet";
}

function valueOrDash(value?: string): string {
  return value?.trim() || "-";
}

function toWalletBalanceLabel(wallet: CustomerWalletItem): string | undefined {
  if (wallet.formattedBalance) {
    return wallet.formattedBalance;
  }

  if (wallet.balance == null) {
    return undefined;
  }

  return String(wallet.balance);
}

const WalletField: FC<{ label: string; value?: string }> = ({ label, value }) => {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="rounded-md border border-border/70 bg-background/40 px-2.5 py-1.5 text-sm text-foreground">
        {valueOrDash(value)}
      </div>
    </div>
  );
};

/**
 * Card view for one customer wallet item.
 *
 * @param props Wallet payload.
 * @returns Wallet metadata card.
 */
export const WalletCard: FC<WalletCardProps> = ({ wallet }) => {
  const balance = toWalletBalanceLabel(wallet);

  return (
    <div className="rounded-lg border border-border/70 bg-background/30 p-3">
      <p className="mb-3 text-sm font-semibold text-foreground">{formatWalletName(wallet)}</p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <WalletField label="Balance" value={balance} />
        <WalletField label="Type" value={wallet.type} />
        <WalletField label="Currency" value={wallet.currency} />
      </div>
    </div>
  );
};
