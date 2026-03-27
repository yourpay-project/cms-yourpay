import type { FC } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";
import { cn } from "@/shared/lib";

import type { CheckItemProps } from "./KycVerificationCheck.type";

/**
 * Renders a single verification check item with status tone + optional score/reason.
 */
export const KycVerificationCheckItem: FC<CheckItemProps> = ({ label, status, score, failedReason }) => {
  const tone = statusTone(status);
  const { Icon, iconClassName, containerClassName } = STATUS_TONE_UI[tone];

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border px-3 py-3",
        containerClassName,
      )}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconClassName)} aria-hidden />
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

function statusTone(status?: string): "ok" | "fail" | "neutral" {
  const s = String(status ?? "").toLowerCase();
  if (!s) return "neutral";
  if (/(fail|error|invalid|false|no)/i.test(s)) return "fail";
  if (/(pass|success|ok|valid|true|yes|complete)/i.test(s)) return "ok";
  return "neutral";
}

const STATUS_TONE_UI: Record<
  "ok" | "fail" | "neutral",
  {
    Icon: LucideIcon;
    iconClassName: string;
    containerClassName: string;
  }
> = {
  ok: {
    Icon: CheckCircle2,
    iconClassName: "text-success",
    containerClassName: "border-success/30 bg-success/5",
  },
  fail: {
    Icon: AlertCircle,
    iconClassName: "text-destructive",
    containerClassName: "border-destructive/30 bg-destructive/5",
  },
  neutral: {
    Icon: HelpCircle,
    iconClassName: "text-muted-foreground",
    containerClassName: "border-border bg-muted/20",
  },
};

