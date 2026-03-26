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
      react({
        // @ts-expect-error: 'babel' is valid in plugin-react but types may drift
        babel: {
          plugins: [["babel-plugin-react-compiler", {}]],
        },
      }),
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
    server: {
      allowedHosts: ["566f-2404-8000-100c-1198-519a-3c5b-2336-90ac.ngrok-free.app"],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
