import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@/shared/ui";
import { cn } from "@/shared/lib";
import { DEMO_CREDENTIALS } from "../constants";
import { getGoogleAuthUrl } from "../api";
import { loginSchema, type LoginFormValues, useLoginMutation } from "../model";
import { GoogleIcon } from "./GoogleIcon";

interface LoginFormProps {
  isUsernamePasswordEnabled?: boolean;
  className?: string;
}

export const LoginForm = ({
  isUsernamePasswordEnabled = true,
  className,
}: LoginFormProps) => {
  const { mutate, isPending } = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginFormValues) => mutate(values);

  const handleGoogleClick = () => {
    window.location.href = getGoogleAuthUrl();
  };

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>YourPay CMS — use your operator account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isUsernamePasswordEnabled && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="text"
                autoComplete="email"
                autoFocus
                placeholder="you@yourpay.co.id"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
        )}

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
          <p className="text-center text-xs text-muted-foreground">
            Demo: {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

