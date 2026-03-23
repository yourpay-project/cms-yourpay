import type { FC } from "react";
import { useMemo } from "react";
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/shared/ui";
import { Modal } from "@/shared/ui/modal";
import { cn } from "@/shared/lib/utils";

import type { KycDocumentImage, KycDocumentVerification } from "@/entities/kyc-submission";

import { VERIFICATION_CHECK_LABELS } from "../lib/verification-check-labels";

export interface VerificationCheckModalProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  onRunChecks: () => Promise<void>;
  isRunning: boolean;

  idDocument?: KycDocumentImage;
  selfieDocument?: KycDocumentImage;

  verification?: KycDocumentVerification;
}

interface CheckItemProps {
  label: string;
  status?: string;
  score?: number;
  failedReason?: string;
}

function statusTone(status?: string): "ok" | "fail" | "neutral" {
  const s = String(status ?? "").toLowerCase();
  if (!s) return "neutral";
  if (/(fail|error|invalid|false|no)/i.test(s)) return "fail";
  if (/(pass|success|ok|valid|true|yes|complete)/i.test(s)) return "ok";
  return "neutral";
}

const CheckItem: FC<CheckItemProps> = ({ label, status, score, failedReason }) => {
  const tone = statusTone(status);
  const Icon = tone === "ok" ? CheckCircle2 : tone === "fail" ? AlertCircle : HelpCircle;
  const iconClass =
    tone === "ok" ? "text-success" : tone === "fail" ? "text-destructive" : "text-muted-foreground";

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border px-3 py-3",
        tone === "ok" && "border-success/30 bg-success/5",
        tone === "fail" && "border-destructive/30 bg-destructive/5",
        tone === "neutral" && "border-border bg-muted/20",
      )}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconClass)} aria-hidden />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="text-sm font-semibold leading-tight text-foreground">{label}</div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>
            Status: <span className="font-medium text-foreground">{status ?? "—"}</span>
          </span>
          {typeof score === "number" ? (
            <span>
              Score: <span className="font-medium text-foreground">{score}</span>
            </span>
          ) : null}
        </div>
        {failedReason ? (
          <p className="text-xs leading-snug text-destructive">
            <span className="font-medium">Reason: </span>
            {failedReason}
          </p>
        ) : null}
      </div>
    </div>
  );
};

/**
 * Modal for triggering and viewing document verification checks.
 * Includes previews for the ID document and selfie photo.
 */
export const VerificationCheckModal: FC<VerificationCheckModalProps> = ({
  open,
  onOpenChange,
  onRunChecks,
  isRunning,
  idDocument,
  selfieDocument,
  verification,
}) => {
  const checkItems = useMemo(() => {
    const v = verification;
    if (!v) return [];

    const entries = [
      { key: "aml", fallbackLabel: "AML", item: v.aml },
      { key: "arc_unique", fallbackLabel: "ARC Unique", item: v.arc_unique },
      { key: "ktp_data_feedback", fallbackLabel: "KTP Data Feedback", item: v.ktp_data_feedback },
      { key: "ktp_data_valid", fallbackLabel: "KTP Data Valid", item: v.ktp_data_valid },
      { key: "ktp_unique", fallbackLabel: "KTP Unique", item: v.ktp_unique },
      { key: "passport_unique", fallbackLabel: "Passport Unique", item: v.passport_unique },
      { key: "selfie_liveness_valid", fallbackLabel: "Selfie Liveness", item: v.selfie_liveness_valid },
      { key: "similar_photo", fallbackLabel: "Photo Similarity", item: v.similar_photo },
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

  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      onOk={() => void onRunChecks()}
      confirmLoading={isRunning}
      okText={isRunning ? "Running..." : "Run Verification Checks"}
      cancelText="Close"
      title="Document Verification Checks"
      description="Preview the documents and trigger verification checks."
      width={860}
      className="max-h-[80vh]"
    >
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
                  <CheckItem
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
      </div>
    </Modal>
  );
};
