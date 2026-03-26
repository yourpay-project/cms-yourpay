import type { FC } from "react";
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import type { VerificationCheckModalCheckItemProps } from "./VerificationCheckModalCheckItem.type";

function statusTone(status?: string): "ok" | "fail" | "neutral" {
  const s = String(status ?? "").toLowerCase();
  if (!s) return "neutral";
  if (/(fail|error|invalid|false|no)/i.test(s)) return "fail";
  if (/(pass|success|ok|valid|true|yes|complete)/i.test(s)) return "ok";
  return "neutral";
}

/**
 * Renders a single verification check row.
 */
export const VerificationCheckModalCheckItem: FC<VerificationCheckModalCheckItemProps> = ({ label, status, score, failedReason }) => {
  const tone = statusTone(status);
  let Icon = HelpCircle;
  let iconClass = "text-muted-foreground";

  if (tone === "ok") {
    Icon = CheckCircle2;
    iconClass = "text-success";
  } else if (tone === "fail") {
    Icon = AlertCircle;
    iconClass = "text-destructive";
  }

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

