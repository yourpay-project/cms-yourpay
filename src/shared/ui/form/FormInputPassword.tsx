import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { FormInput } from "./FormInput";
import type { FormInputProps } from "./FormInput";

/**
 * Props for {@link FormInputPassword}.
 */
export type FormInputPasswordProps = Omit<FormInputProps, "type" | "endIcon">;

/**
 * Password field wrapper with built-in show/hide toggle.
 *
 * @param props - Form input props excluding manual password type and icon wiring.
 * @returns Connected password input with visibility toggle action.
 */
export const FormInputPassword: React.FC<FormInputPasswordProps> = (props) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const passwordType = isPasswordVisible ? "text" : "password";
  const passwordToggleAriaLabel = isPasswordVisible ? "Hide password" : "Show password";
  const PasswordToggleIcon = isPasswordVisible ? EyeOff : Eye;

  return (
    <FormInput
      {...props}
      type={passwordType}
      endIcon={
        <button
          type="button"
          onClick={() => setIsPasswordVisible((prev) => !prev)}
          className="flex items-center text-muted-foreground hover:text-foreground"
          aria-label={passwordToggleAriaLabel}
        >
          <PasswordToggleIcon className="h-4 w-4" aria-hidden />
        </button>
      }
    />
  );
};
