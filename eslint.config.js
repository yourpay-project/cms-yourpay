import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import boundaries from "eslint-plugin-boundaries";

export default tseslint.config(
  { ignores: ["dist"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // General rules for all JS/TS files
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      boundaries: boundaries,
    },
    settings: {
      // Define FSD layer hierarchy
      "boundaries/elements": [
        { type: "app", pattern: "src/app/**/*" },
        { type: "pages", pattern: "src/pages/**/*" },
        { type: "widgets", pattern: "src/widgets/**/*" },
        { type: "features", pattern: "src/features/**/*" },
        { type: "entities", pattern: "src/entities/**/*" },
        { type: "shared", pattern: "src/shared/**/*" },
      ],
      "boundaries/ignore": ["**/*.test.*", "**/*.spec.*"],
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // ==========================================
      // 🛡️ FSD ARCHITECTURE ENFORCEMENT
      // ==========================================

      // 1. LAYER HIERARCHY RULES (Downward Discovery)
      // Prevents lower layers (e.g., shared) from importing from upper layers (e.g., features)
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          message:
            'FSD Violation: Layer "${file.type}" cannot import from "${dependency.type}"! Imports must strictly flow downwards.',
          rules: [
            { from: "app", allow: ["pages", "widgets", "features", "entities", "shared"] },
            { from: "pages", allow: ["widgets", "features", "entities", "shared"] },
            { from: "widgets", allow: ["features", "entities", "shared"] },
            { from: "features", allow: ["entities", "shared"] },
            { from: "entities", allow: ["shared"] },
            { from: "shared", allow: [] }, // Shared is a leaf, strictly no upward imports
          ],
        },
      ],

      // 2. PUBLIC API RULES (Anti Deep-Import)
      // Prevents importing internal files from other slices. Must route through index.ts barrel files.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              // Blocks paths penetrating more than 1 folder deep into an FSD layer
              // Blocked: "@/features/auth/ui/LoginForm"
              // Allowed: "@/features/auth"
              group: [
                "@/app/*/*",
                "@/pages/*/*",
                "@/widgets/*/*",
                "@/features/*/*",
                "@/entities/*/*",
              ],
              message:
                "FSD Violation: Deep imports are strictly forbidden! Use the Public API (index.ts) of the slice. Bad: '@/features/auth/ui/LoginForm'. Good: '@/features/auth'.",
            },
            {
              // Prevents bypassing constraints using relative paths to neighbor slices
              group: ["../*/**/ui/*", "../*/**/model/*", "../*/**/api/*"],
              message:
                "FSD Violation: Cross-slice relative imports are forbidden! Use absolute imports (@/...) targeting the slice's Public API.",
            },
          ],
        },
      ],
      // ==========================================
      // 🛡️ END FSD ENFORCEMENT
      // ==========================================
    },
  },
  {
    files: ["tailwind.config.js", "postcss.config.js", "vite.config.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["src/shared/ui/button.tsx"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  }
);