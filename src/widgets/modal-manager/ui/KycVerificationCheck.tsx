import type { FC } from "react";
import { useMemo } from "react";
import { toKycVerificationCheckItems } from "@/widgets/modal-manager";
import { KycVerificationCheckItem } from "./KycVerificationCheckItem";
import type { KycVerificationCheckProps } from "./KycVerificationCheck.type";
import { KycVerificationCheckDocumentPreview } from "./KycVerificationCheckDocumentPreview";
import { KycVerificationCheckActions } from "./KycVerificationCheckActions";

interface KycVerificationResultsProps {
  hasItems: boolean;
  checkItems: Array<{
    key: string;
    label: string;
    status?: string;
    score?: number;
    failedReason?: string;
  }>;
}

const KycVerificationResults: FC<KycVerificationResultsProps> = ({ hasItems, checkItems }) => {
  if (!hasItems) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/15 px-4 py-6 text-center text-sm text-muted-foreground">
        No verification details available yet.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {checkItems.map((item) => (
        <li key={item.key}>
          <KycVerificationCheckItem
            label={item.label}
            status={item.status}
            score={item.score}
            failedReason={item.failedReason}
          />
        </li>
      ))}
    </ul>
  );
};

/**
 * KYC verification preview modal for documents and check results.
 *
 * @param props Modal handlers, preview assets, and verification state.
 * @returns Verification preview with check result list and action footer.
 */
export const KycVerificationCheck: FC<KycVerificationCheckProps> = ({
  open,
  onClose,
  onRunChecks,
  isRunning,
  idDocument,
  selfieDocument,
  verification,
}) => {
  const checkItems = useMemo(() => toKycVerificationCheckItems(verification), [verification]);

  // `open` is controlled by ModalContainer; this content renders body + actions.
  void open;
  const hasCheckItems = checkItems.length > 0;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <KycVerificationCheckDocumentPreview
          title="ID Document"
          imageUrl={idDocument?.imageUrl}
          imageAlt="ID Document Preview"
        />
        <KycVerificationCheckDocumentPreview
          title="Selfie Photo"
          imageUrl={selfieDocument?.imageUrl}
          imageAlt="Selfie Preview"
        />
      </div>

      <div>
        <div className="mb-2 text-sm font-semibold text-foreground">
          Check results
        </div>
        <KycVerificationResults hasItems={hasCheckItems} checkItems={checkItems} />
      </div>

      <KycVerificationCheckActions
        isRunning={isRunning}
        onClose={onClose}
        onRunChecks={onRunChecks}
      />
    </div>
  );
};
