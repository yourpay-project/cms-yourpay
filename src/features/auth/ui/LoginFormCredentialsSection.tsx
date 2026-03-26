import type { FC, ReactNode } from "react";
import type { UseFormHandleSubmit, UseFormRegister, FieldErrors } from "react-hook-form";
import { Button, Input } from "@/shared/ui";
import type { LoginFormValues } from "../model";
import type { PasswordToggleConfig, FieldStatus } from "./login-form-helpers";

interface LoginFormCredentialsSectionProps {
  isPending: boolean;
  register: UseFormRegister<LoginFormValues>;
  handleSubmit: UseFormHandleSubmit<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  emailStatus: FieldStatus;
  passwordStatus: FieldStatus;
  passwordToggleConfig: PasswordToggleConfig;
  submitLeadingNode: ReactNode;
  onSubmit: (values: LoginFormValues) => void;
  onTogglePasswordVisibility: () => void;
}

/**
 * Username/password credential section for login form.
 *
 * @param props - {@link LoginFormCredentialsSectionProps}
 * @returns Credentials form section (inputs + submit + divider).
 */
export const LoginFormCredentialsSection: FC<LoginFormCredentialsSectionProps> = ({
  isPending,
  register,
  handleSubmit,
  errors,
  emailStatus,
  passwordStatus,
  passwordToggleConfig,
  submitLeadingNode,
  onSubmit,
  onTogglePasswordVisibility,
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Input
          id="email"
          size="md"
          type="text"
          autoComplete="email"
          label="Email"
          allowClear
          status={emailStatus}
          helperText={errors.email?.message}
          {...register("email")}
        />
      </div>
      <div className="space-y-2">
        <Input
          id="password"
          size="md"
          type={passwordToggleConfig.passwordType}
          autoComplete="current-password"
          label="Password"
          status={passwordStatus}
          helperText={errors.password?.message}
          endIcon={
            <button
              type="button"
              onClick={onTogglePasswordVisibility}
              className="flex items-center text-muted-foreground hover:text-foreground"
              aria-label={passwordToggleConfig.ariaLabel}
            >
              {passwordToggleConfig.icon}
            </button>
          }
          {...register("password")}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {submitLeadingNode}
        Sign in
      </Button>
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-2 text-muted-foreground">or</span>
        </div>
      </div>
    </form>
  );
};

