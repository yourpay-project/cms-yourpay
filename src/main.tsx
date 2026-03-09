import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/app";
import { initApiClient } from "@/shared/api";
import "./index.css";

initApiClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
