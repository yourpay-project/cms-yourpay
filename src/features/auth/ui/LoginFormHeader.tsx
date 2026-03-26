import type { FC } from "react";
import { CardHeader, CardTitle } from "@/shared/ui";
import { BRAND_LOGO_URL } from "@/shared/config";

/**
 * Static header block for login card.
 */
export const LoginFormHeader: FC = () => {
  return (
    <CardHeader className="items-center gap-3 text-center">
      <img src={BRAND_LOGO_URL} alt="YourPay" className="h-10 w-auto" />
      <CardTitle>Sign in</CardTitle>
    </CardHeader>
  );
};

