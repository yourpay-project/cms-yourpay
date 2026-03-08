import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initApiClient } from "@/lib/api-config";
import "./index.css";

initApiClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
