import type { FC } from "react";

import { Button } from "@/shared/ui";

import type { KycUserDataCardsFooterActionsProps } from "./KycUserDataCardsFooterActions.type";

/**
 * Rejection note + editable action buttons for `KycUserDataCards`.
 */
export const KycUserDataCardsFooterActions: FC<KycUserDataCardsFooterActionsProps> = ({
  showRejectionNote,
  draft,
  isEditable,
  isSaving,
  isDirty,
  onCancelEdit,
  onSaveEdit,
}) => {
  const rejectionNoteNode = showRejectionNote ? (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">Rejection Note</span>
      <div className="min-h-[3rem] select-text rounded-md border border-input bg-muted/20 px-3 py-2.5 text-sm leading-relaxed text-foreground">
        {draft.rejectionNote?.trim() ? draft.rejectionNote : "—"}
      </div>
    </div>
  ) : null;

  const saveLabel = isSaving ? "Saving..." : "Save Changes";
  const footerActionsNode = isEditable ? (
    <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
      <Button type="button" variant="outline" className="h-9" onClick={onCancelEdit} disabled={isSaving}>
        Cancel
      </Button>
      <Button type="button" className="h-9" onClick={onSaveEdit} disabled={isSaving || !isDirty}>
        {saveLabel}
      </Button>
    </div>
  ) : null;

  return (
    <>
      {rejectionNoteNode}
      {footerActionsNode}
    </>
  );
};

