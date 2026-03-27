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

export function toFieldStatus(hasError: boolean): FieldStatus {
  if (hasError) {
    return "error";
  }
  return undefined;
}

export function getPasswordToggleConfig(isPasswordVisible: boolean): PasswordToggleConfig {
  let key: "hidden" | "visible" = "hidden";
  if (isPasswordVisible) {
    key = "visible";
  }
  return PASSWORD_TOGGLE_CONFIG[key];
}

export function getSubmitLeadingNode(isPending: boolean): ReactNode {
  if (!isPending) {
    return null;
  }
  return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
}

