import type { ReactNode } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export type FieldStatus = "error" | undefined;

export interface PasswordToggleConfig {
  passwordType: "password" | "text";
  ariaLabel: string;
  icon: ReactNode;
}

const PASSWORD_TOGGLE_CONFIG: Record<"hidden" | "visible", PasswordToggleConfig> = {
  hidden: {
    passwordType: "password",
    ariaLabel: "Show password",
    icon: <Eye className="h-4 w-4" aria-hidden="true" />,
  },
  visible: {
    passwordType: "text",
    ariaLabel: "Hide password",
    icon: <EyeOff className="h-4 w-4" aria-hidden="true" />,
  },
};

/**
 * Maps form error state into input status value.
 *
 * @param hasError - Whether field currently has a validation error.
 * @returns Input status for shared input component.
 */
export function toFieldStatus(hasError: boolean): FieldStatus {
  if (hasError) {
    return "error";
  }
  return undefined;
}

/**
 * Resolves password input type and icon config.
 *
 * @param isPasswordVisible - Whether password is currently visible.
 * @returns UI config for password visibility toggle.
 */
export function getPasswordToggleConfig(isPasswordVisible: boolean): PasswordToggleConfig {
  const key: "hidden" | "visible" = isPasswordVisible ? "visible" : "hidden";
  return PASSWORD_TOGGLE_CONFIG[key];
}

/**
 * Builds loading icon for submit button.
 *
 * @param isPending - Whether login submission is in progress.
 * @returns Loader icon node or null.
 */
export function getSubmitLeadingNode(isPending: boolean): ReactNode {
  if (!isPending) {
    return null;
  }
  return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
}

