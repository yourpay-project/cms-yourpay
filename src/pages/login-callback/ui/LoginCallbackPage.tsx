import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getMe, setTokenFromCallback } from "@/features/auth";
import { useAuthStore } from "@/entities/session";
import { ApiClientError } from "@/shared/api";

const LoginCallbackPage = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const token = search.get("token");
    if (token) {
      setTokenFromCallback(token);
    }

    getMe()
      .then((user) => {
        setUser(user);
        toast.success("Signed in successfully");
        navigate({ to: "/", replace: true });
      })
      .catch((err) => {
        setStatus("error");
        const message =
          err instanceof ApiClientError ? err.message : "Failed to complete sign in.";
        toast.error(message);
        navigate({ to: "/login", replace: true });
      });
  }, [setUser, navigate]);

  if (status === "error") return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <Loader2
        className="h-10 w-10 animate-spin text-primary"
        aria-label="Signing in"
      />
      <p className="text-sm text-muted-foreground">Completing sign in...</p>
    </div>
  );
};

export default LoginCallbackPage;

