import type { FC } from "react";
import {
  Ban,
  KeyRound,
  Smartphone,
  WalletCards,
  UserRoundX,
} from "lucide-react";
import { Button } from "@/shared/ui";

interface UserDetailActionButtonsProps {
  isBlocked: boolean;
  onEditIdentityAccess: () => void;
  onViewDevices: () => void;
  onViewWallets: () => void;
  onOpenBlockUser: () => void;
  onOpenCloseUser: () => void;
}

/**
 * Action buttons row for customer detail page.
 *
 * @param props - Button handlers and current blocked state.
 * @returns Action buttons section.
 */
export const UserDetailActionButtons: FC<UserDetailActionButtonsProps> = ({
  isBlocked,
  onEditIdentityAccess,
  onViewDevices,
  onViewWallets,
  onOpenBlockUser,
  onOpenCloseUser,
}) => {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <Button type="button" size="sm" variant="outline" onClick={onEditIdentityAccess}>
        <KeyRound className="h-4 w-4" aria-hidden />
        Edit Identity Access
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={onViewDevices}>
        <Smartphone className="h-4 w-4" aria-hidden />
        View Devices
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={onViewWallets}>
        <WalletCards className="h-4 w-4" aria-hidden />
        View Wallets
      </Button>
      <Button
        type="button"
        size="sm"
        variant={isBlocked ? "secondary" : "destructive"}
        onClick={onOpenBlockUser}
      >
        <Ban className="h-4 w-4" aria-hidden />
        {isBlocked ? "Unblock User" : "Block User"}
      </Button>
      <Button type="button" size="sm" variant="destructive" onClick={onOpenCloseUser}>
        <UserRoundX className="h-4 w-4" aria-hidden />
        Close User
      </Button>
    </div>
  );
};
