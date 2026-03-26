import type { FC } from "react";
import { FileText } from "lucide-react";

import type { KycUserDataCardsHeaderProps } from "./KycUserDataCardsHeader.type";
import { Button } from "@/shared/ui";
import { CardHeader, CardTitle } from "@/shared/ui";

/**
 * Header actions for `KycUserDataCards`.
 */
export const KycUserDataCardsHeader: FC<KycUserDataCardsHeaderProps> = ({
  countryLabel,
  isEditable,
  onUpdateDataFromOcr,
  onOpenEnableEditConfirm,
}) => {
  const enableEditButtonNode = isEditable ? null : (
    <Button
      type="button"
      variant="default"
      size="sm"
      className="h-8 shrink-0"
      onClick={onOpenEnableEditConfirm}
    >
      Enable Edit
    </Button>
  );

  return (
    <CardHeader className="py-4">
      <div className="flex min-w-0 flex-col gap-3">
        <CardTitle className="min-w-0 break-words text-base leading-snug md:text-lg">
          {`User Verification Submission ${countryLabel} Details`}
        </CardTitle>
        <div className="flex w-full justify-end">
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 shrink-0 gap-1.5"
              onClick={onUpdateDataFromOcr}
            >
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Update data from OCR</span>
            </Button>
            {enableEditButtonNode}
          </div>
        </div>
      </div>
    </CardHeader>
  );
};

