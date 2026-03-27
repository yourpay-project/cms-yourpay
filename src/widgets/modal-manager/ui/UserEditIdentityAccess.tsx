import type { FC } from "react";

import { toast } from "sonner";
import { useIdentityAccessOptionsQuery } from "@/entities/user";
import { EditIdentityAccessModalBody } from "@/features/identity-access";
import { useUserEditIdentityAccessLogic } from "@/widgets/modal-manager";

import type { UserEditIdentityAccessProps } from "./UserEditIdentityAccess.type";
import { UserEditIdentityAccessFooter } from "./UserEditIdentityAccessFooter";

/**
 * Modal for editing customer identity access selections.
 */
export const UserEditIdentityAccess: FC<UserEditIdentityAccessProps> = ({
  open,
  onClose,
  customerId,
  currentIdentityAccesses,
}) => {
  const optionsQuery = useIdentityAccessOptionsQuery();
  const {
    search,
    setSearch,
    filteredOptions,
    selectedCodeSet,
    selectedCodes,
    onToggleCode,
  } = useUserEditIdentityAccessLogic({
    open,
    currentIdentityAccesses,
    apiOptions: optionsQuery.data ?? [],
  });

  const onSubmit = (): void => {
    const selectedLabel = selectedCodes.join(", ") || "-";
    toast.info(`TODO: submit identity access update for ${customerId}`, {
      description: `Selected: ${selectedLabel}`,
    });
    onClose();
  };

  return (
    <div className="flex flex-col">
      <EditIdentityAccessModalBody
        search={search}
        onSearchChange={setSearch}
        filteredOptions={filteredOptions}
        selectedCodeSet={selectedCodeSet}
        isLoading={optionsQuery.isLoading}
        isError={optionsQuery.isError}
        onToggleCode={onToggleCode}
      />

      <UserEditIdentityAccessFooter onClose={onClose} onSubmit={onSubmit} />
    </div>
  );
};

