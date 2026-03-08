import { LoginForm } from "@/features/auth/components/LoginForm";

const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? "1.0.0";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen flex-col overflow-y-auto bg-background">
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-8">
        <LoginForm isUsernamePasswordEnabled />
      </main>
      <footer className="shrink-0 space-y-1 border-t border-border bg-card/50 py-4 text-center">
        <p className="text-xs text-muted-foreground">PT Rpay Finansial Digital Indonesia</p>
        <p className="text-xs font-semibold text-muted-foreground">Version {APP_VERSION}</p>
      </footer>
    </div>
  );
};

export default LoginPage;
