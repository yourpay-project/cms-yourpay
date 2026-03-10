import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/app";
import { initApiClient } from "@/shared/api";
import { initSentry } from "@/shared/lib";
import "./index.css";

initSentry();
initApiClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
