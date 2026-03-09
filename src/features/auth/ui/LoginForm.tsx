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
import { loginSchema, type LoginFormValues } from "../model/login-schema";
import { DEMO_CREDENTIALS } from "../constants/demo-auth";
import { getGoogleAuthUrl } from "../api/auth-service";
import { useLoginMutation } from "../model/use-login-mutation";

const GOOGLE_ICON = (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

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
            {GOOGLE_ICON}
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

