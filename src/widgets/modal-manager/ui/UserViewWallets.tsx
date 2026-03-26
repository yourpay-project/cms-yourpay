import type { FC } from "react";
import { useMemo } from "react";

import { useCustomerWalletsQuery, type CustomerWalletItem } from "@/entities/user";

import type { UserViewWalletsProps } from "./UserViewWallets.type";

interface WalletStateMessageProps {
  message: string;
  className: string;
}

interface WalletGroupSectionProps {
  title: string;
  emptyMessage: string;
  wallets: CustomerWalletItem[];
}

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

function valueOrDash(value?: string): string {
  return value?.trim() || "-";
}

function renderWalletField(label: string, value?: string): React.JSX.Element {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="rounded-md border border-border/70 bg-background/40 px-2.5 py-1.5 text-sm text-foreground">
        {valueOrDash(value)}
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

const WalletStateMessage: FC<WalletStateMessageProps> = ({ message, className }) => {
  return (
    <div className="-mx-6 -mr-6 max-h-[70vh] overflow-y-auto pb-2 pr-6">
      <div className="space-y-3 px-6">
        <p className={className}>{message}</p>
      </div>
    </div>
  );
};

const WalletGroupSection: FC<WalletGroupSectionProps> = ({ title, emptyMessage, wallets }) => {
  const walletListNode =
    wallets.length === 0 ? (
      <p className="text-sm text-muted-foreground">{emptyMessage}</p>
    ) : (
      <>{wallets.map((wallet) => renderWalletCard(wallet))}</>
    );

  return (
    <section className="rounded-lg border border-border/70 bg-muted/20 p-3">
      <p className="mb-3 text-sm font-semibold text-foreground">{title}</p>
      <div className="space-y-3">{walletListNode}</div>
    </section>
  );
};

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

