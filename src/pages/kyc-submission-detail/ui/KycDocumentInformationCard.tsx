import type { FC } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

import type { KycDocumentInformationCardProps } from "./KycDocumentInformationCard.type";
import { useKycDocumentInformationCardLogic } from "../model/use-kyc-document-information-card-logic";
import { KycIdentityDocumentTypeSection } from "./KycIdentityDocumentTypeSection";
import { KycPassportDatesSection } from "./KycPassportDatesSection";
import { KycOccupationAndArcSection } from "./KycOccupationAndArcSection";

/**
 * Document Information card for identity type/number + passport dates + occupation + ARC (non-Indonesia).
 */
export const KycDocumentInformationCard: FC<KycDocumentInformationCardProps> = ({
  countryCode,
  draft,
  setDraft,
  isEditable,
}) => {
  const { locked, isPassport, isIndonesia, documentTypeOptions, occupationOptions, occupationsLoading, onDocumentTypeChange, onOccupationChange } =
    useKycDocumentInformationCardLogic({ countryCode, draft, setDraft, isEditable });

  const passportDatesNode = isPassport ? (
    <KycPassportDatesSection
      draft={draft}
      setDraft={setDraft}
      isEditable={isEditable}
      locked={locked}
    />
  ) : null;

  return (
    <Card className="min-w-0 max-w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Document Information</CardTitle>
      </CardHeader>
      <CardContent className="min-w-0 max-w-full">
        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <KycIdentityDocumentTypeSection
              draft={draft}
              setDraft={setDraft}
              isEditable={isEditable}
              locked={locked}
              documentTypeOptions={documentTypeOptions}
              onDocumentTypeChange={onDocumentTypeChange}
              isPassport={isPassport}
            />
          </div>

          {passportDatesNode}

          <div className="md:col-span-2">
            <KycOccupationAndArcSection
              draft={draft}
              setDraft={setDraft}
              isEditable={isEditable}
              locked={locked}
              isIndonesia={isIndonesia}
              occupationOptions={occupationOptions}
              occupationsLoading={occupationsLoading}
              onOccupationChange={onOccupationChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

