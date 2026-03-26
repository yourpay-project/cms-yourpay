import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@/shared/ui";
import { BRAND_LOGO_URL } from "@/shared/config";
import { cn } from "@/shared/lib";
import { getGoogleAuthUrl } from "../api";
import { loginSchema, type LoginFormValues, useLoginMutation } from "../model";
import { GoogleIcon } from "./GoogleIcon";
import { getPasswordToggleConfig, getSubmitLeadingNode, toFieldStatus } from "./login-form-helpers";

interface LoginFormProps {
  isUsernamePasswordEnabled?: boolean;
  className?: string;
}

export const LoginForm: FC<LoginFormProps> = ({
  isUsernamePasswordEnabled = true,
  className,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { mutate, isPending } = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const onSubmit = (values: LoginFormValues) => mutate(values);

  const handleGoogleClick = () => {
    window.location.href = getGoogleAuthUrl();
  };

  const passwordToggleConfig = getPasswordToggleConfig(isPasswordVisible);
  const submitLeadingNode = getSubmitLeadingNode(isPending);

  let usernamePasswordFormNode: ReactNode = null;
  if (isUsernamePasswordEnabled) {
    const emailStatus = toFieldStatus(errors.email != null);
    const passwordStatus = toFieldStatus(errors.password != null);

    usernamePasswordFormNode = (
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
                onClick={() => setIsPasswordVisible((prev) => !prev)}
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
  }

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="items-center gap-3 text-center">
        <img src={BRAND_LOGO_URL} alt="YourPay" className="h-10 w-auto" />
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {usernamePasswordFormNode}

        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-3 border-border bg-background hover:bg-accent"
            onClick={handleGoogleClick}
            disabled={isPending}
          >
            <GoogleIcon className="h-5 w-5" />
            Sign in with Google
          </Button>
          <div className="rounded-lg border border-border bg-muted p-3">
            <p className="break-words text-center text-xs leading-relaxed text-foreground">
              Access restricted to operators and operations team only. Use{" "}
              <strong className="font-semibold">@yourpay.co.id</strong> email.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

