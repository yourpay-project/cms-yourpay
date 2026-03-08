import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getMe, setTokenFromCallback } from "@/features/auth/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import { ApiClientError } from "@/lib/api-client";

/**
 * Handles redirect from Google OAuth. BE may redirect here with ?token=... or set cookies and redirect to /.
 * If token in query: store it, fetch /me, setUser, redirect to /.
 */
const LoginCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setTokenFromCallback(token);
    }

    getMe()
      .then((user) => {
        setUser(user);
        toast.success("Signed in successfully");
        navigate("/", { replace: true });
      })
      .catch((err) => {
        setStatus("error");
        const message =
          err instanceof ApiClientError ? err.message : "Failed to complete sign in.";
        toast.error(message);
        navigate("/login", { replace: true });
      });
  }, [searchParams, setUser, navigate]);

  if (status === "error") return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary" aria-label="Signing in" />
      <p className="text-sm text-muted-foreground">Completing sign in...</p>
    </div>
  );
};

export default LoginCallbackPage;
