import type { ComponentProps, FC } from "react";

import { cn } from "@/shared/lib";
import { Card, CardContent, ContentSeparator } from "@/shared/ui";

import { getGoogleAuthUrl } from "../api";
import { type LoginFormValues, useLoginMutation } from "../model";
import { LoginFooter } from "./LoginFooter";
import { LoginForm } from "./LoginForm";
import { LoginHeader } from "./LoginHeader";
import { LoginInfo } from "./LoginInfo";
import { LoginWithGoogle } from "./LoginWithGoogle";

interface LoginCardProps extends ComponentProps<"div"> {
  appVersion: string;
}

/**
 * Root login card composition used by the login page.
 *
 * @param props - Login card display options.
 * @returns Login card with sectioned auth layout.
 */
export const LoginCard: FC<LoginCardProps> = ({ className, appVersion, ...cardProps }) => {
  const { mutate, isPending: isLoading } = useLoginMutation();
  const onSubmitCredentials = (values: LoginFormValues) => mutate(values);

  const handleGoogleClick = () => {
    window.location.href = getGoogleAuthUrl();
  };

  return (
    <Card {...cardProps} className={cn("w-full max-w-md", className)}>
      <LoginHeader />
      <CardContent className="space-y">
        <LoginForm isLoading={isLoading} onSubmitCredentials={onSubmitCredentials} />
        <ContentSeparator orientation="horizontal" label="or" className="py-4" />
        <LoginWithGoogle isLoading={isLoading} onGoogleClick={handleGoogleClick} />
        <LoginInfo />
        <LoginFooter appVersion={appVersion} />
      </CardContent>
    </Card>
  );
};
