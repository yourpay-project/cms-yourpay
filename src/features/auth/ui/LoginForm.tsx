import type { FC } from "react";
import { Card } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { getGoogleAuthUrl } from "../api";
import { type LoginFormValues, useLoginMutation } from "../model";
import { LoginFormContent } from "./LoginFormContent";
import { LoginFormHeader } from "./LoginFormHeader";

interface LoginFormProps {
  isUsernamePasswordEnabled?: boolean;
  className?: string;
}

export const LoginForm: FC<LoginFormProps> = ({
  isUsernamePasswordEnabled = true,
  className,
}) => {
  const { mutate, isPending } = useLoginMutation();
  const onSubmitCredentials = (values: LoginFormValues) => mutate(values);

  const handleGoogleClick = () => {
    window.location.href = getGoogleAuthUrl();
  };

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <LoginFormHeader />
      <LoginFormContent
        isUsernamePasswordEnabled={isUsernamePasswordEnabled}
        isPending={isPending}
        onCredentialsSubmit={onSubmitCredentials}
        onGoogleClick={handleGoogleClick}
      />
    </Card>
  );
};

