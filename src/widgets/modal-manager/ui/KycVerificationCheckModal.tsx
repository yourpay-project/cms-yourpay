import type { FC } from "react";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Button, Card, CardContent } from "@/shared/ui";
import { KycVerificationCheckItem } from "./KycVerificationCheckItem";
import type { KycVerificationCheckModalProps } from "./KycVerificationCheckModal.type";

const VERIFICATION_CHECK_LABELS: Record<string, string> = {
  aml: "AML",
  arc_unique: "ARC Unique",
  ktp_data_feedback: "KTP Data Feedback",
  ktp_data_valid: "KTP Data Valid",
  ktp_unique: "KTP Unique",
  passport_unique: "Passport Unique",
  selfie_liveness_valid: "Selfie Liveness",
  similar_photo: "Photo Similarity",
};

/**
 * KYC verification preview modal for documents and check results.
 */
export const KycVerificationCheckModal: FC<KycVerificationCheckModalProps> = ({
  open,
  onClose,
  onRunChecks,
  isRunning,
  idDocument,
  selfieDocument,
  verification,
}) => {
  const checkItems = useMemo(() => {
    if (!verification) return [];

    const entries = [
      { key: "aml", fallbackLabel: "AML", item: verification.aml },
      { key: "arc_unique", fallbackLabel: "ARC Unique", item: verification.arc_unique },
      { key: "ktp_data_feedback", fallbackLabel: "KTP Data Feedback", item: verification.ktp_data_feedback },
      { key: "ktp_data_valid", fallbackLabel: "KTP Data Valid", item: verification.ktp_data_valid },
      { key: "ktp_unique", fallbackLabel: "KTP Unique", item: verification.ktp_unique },
      { key: "passport_unique", fallbackLabel: "Passport Unique", item: verification.passport_unique },
      { key: "selfie_liveness_valid", fallbackLabel: "Selfie Liveness", item: verification.selfie_liveness_valid },
      { key: "similar_photo", fallbackLabel: "Photo Similarity", item: verification.similar_photo },
    ];

    return entries
      .filter((entry) => Boolean(entry.item))
      .map((entry) => ({
        key: entry.key,
        label: VERIFICATION_CHECK_LABELS[entry.key] ?? entry.fallbackLabel,
        status: entry.item?.status,
        score: entry.item?.score,
        failedReason: entry.item?.failedReason,
      }));
  }, [verification]);

  // `open` is controlled by ModalContainer; this content renders body + actions.
  void open;

  return (
    <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="overflow-hidden border-border/80">
            <CardContent className="p-4">
              <div className="text-sm font-semibold text-foreground">ID Document</div>
              <div className="mt-3 aspect-[4/3] overflow-hidden rounded-lg border border-border/60 bg-muted/30">
                {idDocument?.imageUrl ? (
                  <img src={idDocument.imageUrl} alt="ID Document Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full min-h-[140px] items-center justify-center text-sm text-muted-foreground">No image</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-border/80">
            <CardContent className="p-4">
              <div className="text-sm font-semibold text-foreground">Selfie Photo</div>
              <div className="mt-3 aspect-[4/3] overflow-hidden rounded-lg border border-border/60 bg-muted/30">
                {selfieDocument?.imageUrl ? (
                  <img src={selfieDocument.imageUrl} alt="Selfie Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full min-h-[140px] items-center justify-center text-sm text-muted-foreground">No image</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="mb-2 text-sm font-semibold text-foreground">Check results</div>
          {checkItems.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/15 px-4 py-6 text-center text-sm text-muted-foreground">
              No verification details available yet.
            </div>
          ) : (
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
          )}
        </div>
        <div className="flex items-center justify-end gap-2 pb-5 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            type="button"
            onClick={() => {
              void onRunChecks?.();
            }}
            disabled={Boolean(isRunning)}
          >
            {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isRunning ? "Running..." : "Run Verification Checks"}
          </Button>
        </div>
    </div>
  );
};
