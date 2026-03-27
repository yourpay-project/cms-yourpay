import type { LoginFormValues } from "../model";

/**
 * Props for login credential form content.
 */
export interface LoginFormProps {
  isLoading: boolean;
  onSubmitCredentials: (values: LoginFormValues) => void;
}
