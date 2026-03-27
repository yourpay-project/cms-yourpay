import type { FC } from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button, Input } from "@/shared/ui";

import { type LoginFormValues, loginSchema } from "../model";
import { getPasswordToggleConfig, getSubmitLeadingNode, toFieldStatus } from "./login-form-helpers";

interface LoginFormProps {
  isPending: boolean;
  onSubmitCredentials: (values: LoginFormValues) => void;
}

/**
 * Email-password login form section.
 *
 * @param props - Form submit handlers and pending state.
 * @returns Login form with divider before Google section.
 */
export const LoginForm: FC<LoginFormProps> = ({ isPending, onSubmitCredentials }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const passwordToggleConfig = getPasswordToggleConfig(isPasswordVisible);
  const submitLeadingNode = getSubmitLeadingNode(isPending);
  const emailStatus = toFieldStatus(errors.email != null);
  const passwordStatus = toFieldStatus(errors.password != null);

  return (
    <form onSubmit={handleSubmit(onSubmitCredentials)} className="space-y-4">
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
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            className="flex items-center text-muted-foreground hover:text-foreground"
            aria-label={passwordToggleConfig.ariaLabel}
          >
            {passwordToggleConfig.icon}
          </button>
        }
        {...register("password")}
      />
      <Button type="submit" className="w-full" disabled={isPending}>
        {submitLeadingNode}
        Sign in
      </Button>
    </form>
  );
};

