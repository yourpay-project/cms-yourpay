// Sentry initialization must run before any other imports,
// following the official React SPA integration guide.
import "@/app/sentry";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import { App } from "@/app";
import { initApiClient } from "@/shared/api";
import { validateEnv } from "@/shared/lib";
import "./index.css";

validateEnv();
initApiClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<p>Something went wrong.</p>}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>
);
