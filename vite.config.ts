import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import packageJson from "./package.json";

export default defineConfig(() => {
  const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;
  const sentryOrg = process.env.SENTRY_ORG;
  const sentryProject = process.env.SENTRY_PROJECT;
  const sentryRelease = packageJson.version;

  const enableSentryUpload = !!(sentryAuthToken && sentryOrg && sentryProject && sentryRelease);

  return {
    plugins: [
      react(),
      ...(enableSentryUpload
        ? [
            sentryVitePlugin({
              org: sentryOrg,
              project: sentryProject,
              authToken: sentryAuthToken,
              release: { name: sentryRelease },
            }),
          ]
        : []),
    ],
    build: {
      sourcemap: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
