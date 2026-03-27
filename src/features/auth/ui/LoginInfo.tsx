import type { FC } from "react";

/**
 * Access restriction notice on login card.
 *
 * @returns Operator-only access information.
 */
export const LoginInfo: FC = () => {
  return (
    <div className="rounded-lg border border-border bg-muted p-3 mt-8">
      <p className="break-words text-center text-xs leading-relaxed text-foreground">
        Access restricted to operators and operations team only. Use{" "}
        <strong className="font-semibold">@yourpay.co.id</strong> email.
      </p>
    </div>
  );
};
