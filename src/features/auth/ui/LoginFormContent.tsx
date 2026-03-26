import type { FC, ReactNode } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardContent } from "@/shared/ui";
import { loginSchema, type LoginFormValues } from "../model";
import { getPasswordToggleConfig, getSubmitLeadingNode, toFieldStatus } from "./login-form-helpers";
import { LoginFormCredentialsSection } from "./LoginFormCredentialsSection";
import { LoginFormFooter } from "./LoginFormFooter";

interface LoginFormContentProps {
  isUsernamePasswordEnabled: boolean;
  isPending: boolean;
  onCredentialsSubmit: (values: LoginFormValues) => void;
  onGoogleClick: () => void;
}

/**
 * Content composition for login card: credentials and footer.
 *
 * @param props - {@link LoginFormContentProps}
 * @returns Login card content (credentials section + footer).
 */
export const LoginFormContent: FC<LoginFormContentProps> = ({
  isUsernamePasswordEnabled,
  isPending,
  onCredentialsSubmit,
  onGoogleClick,
}) => {
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

  let credentialsSectionNode: ReactNode = null;
  if (isUsernamePasswordEnabled) {
    credentialsSectionNode = (
      <LoginFormCredentialsSection
        isPending={isPending}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        emailStatus={emailStatus}
        passwordStatus={passwordStatus}
        passwordToggleConfig={passwordToggleConfig}
        submitLeadingNode={submitLeadingNode}
        onSubmit={onCredentialsSubmit}
        onTogglePasswordVisibility={() => setIsPasswordVisible((prev) => !prev)}
      />
    );
  }

  return (
    <CardContent className="space-y-4">
      {credentialsSectionNode}
      <LoginFormFooter isPending={isPending} onGoogleClick={onGoogleClick} />
    </CardContent>
  );
};

