import type { FC } from "react";
import { LoginCard } from "@/features/auth";

const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? "1.0.0";

/**
 * Public login page layout.
 *
 * @returns Centered login card layout.
 */
const LoginPage: FC = () => {
  return (
    <div className="flex min-h-screen flex-col overflow-y-auto bg-background">
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-8">
        <LoginCard appVersion={APP_VERSION} />
      </main>
    </div>
  );
};

export default LoginPage;

