import type { FC } from "react";

import { BRAND_LOGO_URL } from "@/shared/config";
import { CardHeader, CardTitle } from "@/shared/ui";

/**
 * Header section for login card.
 *
 * @returns Brand logo and "Sign in" title.
 */
export const LoginHeader: FC = () => {
  return (
    <CardHeader className="items-center gap-3 text-center">
      <img src={BRAND_LOGO_URL} alt="YourPay" className="h-10 w-auto" />
      <CardTitle>Sign in</CardTitle>
    </CardHeader>
  );
};
