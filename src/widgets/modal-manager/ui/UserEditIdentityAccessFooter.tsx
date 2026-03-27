import type { FC } from "react";

import { Button } from "@/shared/ui";

interface UserEditIdentityAccessFooterProps {
  isDirty: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

/**
 * Footer actions for identity access edit modal.
 *
 * @param props Dirty state and action handlers.
 * @returns Cancel/submit action row.
 */
export const UserEditIdentityAccessFooter: FC<UserEditIdentityAccessFooterProps> = ({
  isDirty,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="flex items-center justify-end gap-2 pb-5 pt-4">
      <Button type="button" variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button type="button" variant="default" onClick={onSubmit} disabled={!isDirty}>
        Submit
      </Button>
    </div>
  );
};
