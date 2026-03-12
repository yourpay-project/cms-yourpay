# YourPay CMS (React + Vite)

YourPay CMS is an internal console for content, operations, and reporting, built with **React 18**, **Vite**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **TanStack Query/Router**, and **Zustand**.  
The codebase follows **Feature‑Sliced Design (FSD)** as enforced by `.cursorrules`.

This document is written for **new engineers** joining the project. It explains how the repository is structured, how data and routing work, and how to safely add new features.

---

## 1. Tech Stack Overview

- **Runtime / Framework**
  - React 18
  - Vite (build + dev server)
- **Language**
  - TypeScript (strict, no `any`)
- **Routing**
  - TanStack Router (`@tanstack/react-router`)
- **Data / HTTP**
  - TanStack Query (`@tanstack/react-query`)
  - Custom fetch wrapper: `shared/api/api-client.ts`
- **State Management**
  - Zustand (`entities/*` for domain state, `shared/lib` for cross‑cutting state)
- **UI**
  - Tailwind CSS with semantic tokens (`bg-background`, `text-foreground`, etc.)
  - shadcn/ui components re‑exported from `shared/ui`
  - Icons from `lucide-react`
- **Feedback**
  - `sonner` toasts

---

## 2. Project Structure (FSD)

All application code lives under `src/` and follows the FSD layering rules.  
Valid import direction: **`app → pages → widgets → features → entities → shared`** (never upwards).

```text
src/
├── app/                     # Global app shell (router, providers)
│   ├── App.tsx
│   └── index.ts
├── pages/                   # Page slices (routing targets)
│   ├── dashboard/
│   │   ├── ui/DashboardPage.tsx
│   │   └── index.ts
│   ├── login/
│   │   ├── ui/LoginPage.tsx
│   │   └── index.ts
│   ├── login-callback/
│   │   ├── ui/LoginCallbackPage.tsx
│   │   └── index.ts
│   └── user-list/
│       ├── ui/UserListPage.tsx
│       └── index.ts
├── widgets/                 # Large, reusable page sections
│   ├── app-layout/
│   │   ├── ui/AppLayout.tsx
│   │   ├── ui/Nav.tsx
│   │   ├── ui/Sidebar.tsx
│   │   ├── model/nav-config.tsx
│   │   ├── model/sidebar-store.ts
│   │   └── index.ts
│   ├── data-table/         # Generic table (TanStack Table + shadcn)
│   │   ├── ui/DataTable.tsx, DataTableHead, DataTableBody, DataTablePagination
│   │   ├── model/data-table-types.ts, use-data-table-instance.ts
│   │   └── index.ts
│   └── user-table/         # User list table (uses data-table)
│       ├── ui/UserTable.tsx
│       └── index.ts
├── features/                # User interactions with business value
│   └── auth/
│       ├── ui/…             # LoginForm, ProtectedRoute, LoginRedirect, Can
│       ├── model/…          # Hooks (useAuth, useCan, useLoginMutation, …)
│       ├── api/auth-service.ts
│       ├── constants/demo-auth.ts
│       └── index.ts         # Public API for the auth feature
├── entities/                # Business entities and domain state
│   ├── session/
│   │   ├── model/types.ts   # AuthUser, Role, Permission, JwtPayload
│   │   ├── model/auth-store.ts
│   │   └── index.ts
│   └── user/
│       ├── model/types.ts   # User
│       ├── api/use-users-query.ts
│       └── index.ts
└── shared/                  # Purely reusable, non‑domain modules
    ├── api/                 # API client + TanStack helpers
    │   ├── api-client.ts
    │   ├── api-config.ts
    │   ├── use-api-query.ts
    │   └── index.ts
    ├── lib/                 # Utilities and cross‑cutting state
    │   ├── utils.ts         # `cn` helper
    │   ├── loading-store.ts # Global loading flag
    │   ├── theme-store.ts   # Light/dark/system theme state
    │   ├── use-theme-effect.ts
    │   └── index.ts
    └── ui/                  # shadcn/ui facade
        ├── button.tsx
        ├── card.tsx
        ├── dropdown-menu.tsx
        ├── input.tsx
        ├── skeleton.tsx
        ├── page-skeleton.tsx
        ├── theme-toggle.tsx
        ├── table.tsx        # Table, TableHeader, TableBody, TableRow, TableHead, TableCell, etc.
        └── index.ts
```

### Import Rules

- **Do not deep‑import** feature or entity internals.
  - ✅ `import { useAuth } from "@/features/auth";`
  - ❌ `import { useAuth } from "@/features/auth/model/use-auth";`
- **Layer direction**
  - `app` can import from any layer.
  - `pages` can import from `widgets`, `features`, `entities`, `shared`.
  - `widgets` can import from `features`, `entities`, `shared`.
  - `features` can import from `entities`, `shared`.
  - `entities` can import from `shared`.
  - `shared` is leaf; it does not import from anything above it.

---

## 3. Running the App

### Requirements

- Node.js 20+
- npm 10+

### Setup

```bash
npm install
cp .env.example .env        # Adjust values as needed
```

### Development

```bash
npm run dev
# or
make run
```

### Lint, Build, Preview

```bash
# Lint
npm run lint
# or
make lint

# Build
npm run build
# or
make build

# Preview production build
npm run preview
```

---

## 4. Environment Variables

Configured via `.env` (see `.env.example`):

- `VITE_API_BASE_URL`  
  Base URL for the backend API (e.g. `https://api.yourpay.co.id` or `/api`).

- `VITE_GOOGLE_AUTH_URL`  
  Optional explicit URL for Google OAuth redirect. If not set, the app falls back to  
  `\`${VITE_API_BASE_URL}/auth/google\``.

- `VITE_APP_VERSION`  
  Displayed in the login page footer.

- `VITE_SENTRY_DSN` / `VITE_SENTRY_ENABLED`  
  Optional Sentry integration for frontend and HTTP API errors.  
  - Set `VITE_SENTRY_DSN` to your project DSN and `VITE_SENTRY_ENABLED=true` to enable.
  - Sentry is initialized in `src/app/sentry.ts` and imported first in `src/main.tsx` following the official React SPA guide (`@sentry/react`).
  - The app is wrapped with `Sentry.ErrorBoundary` in `src/main.tsx` so uncaught render errors surface in Sentry.

- `VITE_APP_ENV`  
  Logical app environment: `"development"`, `"staging"`, or `"production"`.  
  Used as Sentry `environment` together with the app `version` from `package.json` for Sentry `release`.

Optional Sentry sampling (all default to `0`, meaning disabled):

- `VITE_SENTRY_TRACES_SAMPLE_RATE`  
  Fraction of transactions to capture for performance tracing (0–1). When `> 0`, `browserTracingIntegration` is enabled.

- `VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE` / `VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE`  
  Session Replay sampling. When either is `> 0`, `replayIntegration` is enabled.

Build‑time Sentry configuration (used only by the Vite plugin for sourcemaps):

- `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`  
  Optional CI/build‑time env vars used by `@sentry/vite-plugin` to upload source maps when building for production.  
  If any of these are missing, the plugin is not enabled and the build behaves like a normal Vite build.

---

## 5. Architecture for New Engineers

### 5.1 Routing (TanStack Router)

File: `app/App.tsx`

- Defines the route tree using `createRootRoute` and `createRoute`.
- Wraps everything in:
  - `QueryClientProvider` (TanStack Query)
  - `RouterProvider` (TanStack Router)
  - `ThemeProvider` and `Toaster`
  - Key routes:
  - `/` → `DashboardPage` inside `AppLayout`, wrapped with `ProtectedRoute`.
  - `/login` → `LoginPage` wrapped with `LoginRedirect`.
  - `/login/callback` → `LoginCallbackPage` (Google OAuth callback).
  - `/customers` → `UserListPage` (paginated user table; see Data tables below).
  - Other sidebar routes (e.g. `/identity-access`) use a shared `SectionPage` placeholder.

For navigation inside components, use **TanStack Router hooks**:

- `useNavigate()` – navigate by `to: "/path"`.
- `Link` – for declarative navigation from the sidebar.

### 5.2 Auth & Session

**Domain state (entities):**

- `entities/session/model/types.ts`
  - `AuthUser`, `Role`, `Permission`, `JwtPayload`.
- `entities/session/model/auth-store.ts`
  - Zustand store `useAuthStore` with:
    - `user`, `isAuthenticated`.
    - Permission/role helpers: `hasPermission`, `hasAnyPermission`, `hasRole`, `hasAnyRole`.
  - Persisted under `cms-auth` key in `localStorage`.

**Feature API and hooks (features/auth):**

- `features/auth/api/auth-service.ts`
  - `login(payload)` → `POST /auth/login` (expects `{ access_token, refresh_token?, user }`).
  - `getMe()` → `GET /auth/me`.
  - `logout()` → clears cookies and calls `POST /auth/logout` (best‑effort).
  - `getGoogleAuthUrl()` → builds OAuth URL.
  - `setTokenFromCallback(token)` → store access token from callback.
- `features/auth/model/use-auth.ts`
  - `useAuth()` → `{ user, isAuthenticated, setUser, logout }` convenience hook wrapping `useAuthStore`.
- `features/auth/model/use-can.ts`
  - `useCan()` → `{ can, canAny, hasRole, hasAnyRole }` RBAC helper.
- `features/auth/model/use-permissions.ts`
  - `usePermissions()` → read‑only view of current user’s permissions.
- `features/auth/model/use-login-mutation.ts`
  - TanStack Query mutation that:
    - Uses demo credentials if configured.
    - Calls `login()`, stores user in `useAuthStore`, and redirects to `/`.
- `features/auth/model/use-logout.ts`
  - Clears session and navigates to `/login`.

**Auth UI (features/auth/ui):**

- `LoginForm` – email/password form with Google button.
- `ProtectedRoute` – renders children only when authenticated; otherwise navigates to `/login`.
- `LoginRedirect` – for `/login`; if already authenticated, redirects to `/`.
- `Can` – conditional renderer based on permissions/roles (wrapping `useCan`).

### 5.3 Layout & Sidebar (widgets/app-layout)

- `ui/AppLayout.tsx`
  - Top nav (`Nav`), left sidebar (`Sidebar`), and main content area.
  - Receives optional `navTitle` and `children`.
- `ui/Nav.tsx`
  - App title, global loading indicator, sidebar toggle, theme toggle, and user menu (email + logout).
- `ui/Sidebar.tsx`
  - Renders navigation groups from `model/nav-config.tsx`.
  - Respects RBAC via `useCan`.
  - Supports:
    - **Pinned section** (max 5 items) that stays fixed at the top.
    - **Search** input (with icon) for filtering non‑pinned items by label.
    - Collapsed mode (icons only) while preserving pin state.
- `model/nav-config.tsx`
  - Declarative config of sidebar sections and items:
    - `{ group?: string; items: { to, label, icon, permission? }[] }`.
- `model/sidebar-store.ts`
  - Zustand store `useSidebarStore`:
    - `collapsed`, `setCollapsed`, `toggle`.
    - `pinned: string[]`, `togglePinned(path)`; pinned entries are persisted.

### 5.4 Shared Layer

- `shared/api/api-client.ts`
  - `apiRequest` wrapper around `fetch` with:
    - Base URL handling (from `VITE_API_BASE_URL`).
    - Access/refresh token support via cookies.
    - 401 handling and optional token refresh via `/auth/refresh`.
    - Typed `ApiClientError`.
  - `apiClient` with typed `get/post/put/patch/delete`.
- `shared/api/use-api-query.ts`
  - `useApiQuery(queryKey, path, options)` – small helper around TanStack Query for REST‑style GETs.
- `shared/lib/*`
  - `utils.ts` – `cn` function combining `clsx` + `tailwind-merge`.
  - `loading-store.ts` – `useLoadingStore` for global loading flags.
  - `theme-store.ts` – `useThemeStore` for app theme.
  - `use-theme-effect.ts` – applies theme to `document.documentElement` and listens to system changes.
- `shared/ui/*`
  - shadcn/ui components wired with Tailwind theme tokens (Button, Card, DropdownMenu, Input, Skeleton, PageSkeleton, ThemeToggle, **Table** primitives).

### 5.5 Data tables (widgets/data-table, widgets/user-table)

Tables use **@tanstack/react-table** in the widgets layer with shadcn-style UI from `shared/ui/table`.

- **`widgets/data-table`** – generic, plug-and-play table:
  - `DataTable` – full table with Head, Body, and Pagination. Supports client-side and server-side pagination via `pagination`, `onPaginationChange`, and `rowCount`.
  - `DataTableHead`, `DataTableBody`, `DataTablePagination` – presentational subcomponents for custom layouts.
  - `useDataTableInstance` – hook that builds TanStack Table state and instance; use with the subcomponents for custom UIs.
  - Types: `DataTableProps`, `DataTableInstance`, and props for Head/Body/Pagination.
- **`widgets/user-table`** – `UserTable` composes `DataTable` with user columns and server-side pagination; used by the user-list page.
- **`entities/user`** – `User` type and `useUsersQuery({ pageIndex, pageSize })` for the users list API.
- **`pages/user-list`** – `UserListPage` at `/customers`: loads users with `useUsersQuery`, shows loading/error states, and renders `UserTable`.

Example – use the full table:

```tsx
import { DataTable, type DataTableProps } from "@/widgets/data-table";

<DataTable columns={columns} data={data} initialPageSize={10} />
```

Example – custom layout with hook + subcomponents:

```tsx
import { useDataTableInstance, DataTableHead, DataTableBody, DataTablePagination } from "@/widgets/data-table";

const { table, canPreviousPage, canNextPage, currentPage, totalPages } = useDataTableInstance({ columns, data, initialPageSize: 10 });
// Render <Table><DataTableHead table={table} /><DataTableBody table={table} columnCount={columns.length} /></Table> and DataTablePagination.
```

---

## 6. How to Add a New Feature (Step‑by‑Step)

Example: add a new **“Reports”** feature with a table page.

1. **Create the feature slice**

   ```text
   src/features/reports/
     ├── ui/
     ├── model/
     ├── api/
     └── index.ts
   ```

2. **Add API calls in `features/reports/api`**

   ```ts
   // src/features/reports/api/reports-service.ts
   import { apiClient } from "@/shared/api";

   export interface ReportRow { /* ... */ }

   export const fetchReports = () =>
     apiClient.get<ReportRow[]>("reports").then((res) => res.data);
   ```

3. **Add hooks in `features/reports/model`**

   ```ts
   // src/features/reports/model/use-reports.ts
   import { useApiQuery } from "@/shared/api";

   export const useReports = () =>
     useApiQuery(["reports"], "reports");
   ```

4. **Add UI in `features/reports/ui`**

   ```tsx
   // src/features/reports/ui/ReportsTable.tsx
   import { useReports } from "../model/use-reports";
   import { PageSkeleton } from "@/shared/ui";

   export const ReportsTable = () => {
     const { data, isLoading } = useReports();
     if (isLoading) return <PageSkeleton title rows={10} />;
     // render table here
   };
   ```

5. **Export from the feature’s `index.ts`**

   ```ts
   // src/features/reports/index.ts
   export { ReportsTable } from "./ui/ReportsTable";
   export { useReports } from "./model/use-reports";
   ```

6. **Create a page slice**

   ```text
   src/pages/reports/
     ├── ui/ReportsPage.tsx
     └── index.ts
   ```

   ```tsx
   // src/pages/reports/ui/ReportsPage.tsx
   import { ReportsTable } from "@/features/reports";

   const ReportsPage = () => (
     <div className="space-y-4">
       <h2 className="text-xl font-semibold">Reports</h2>
       <ReportsTable />
     </div>
   );

   export default ReportsPage;
   ```

   ```ts
   // src/pages/reports/index.ts
   export { default as ReportsPage } from "./ui/ReportsPage";
   ```

7. **Wire routing and navigation**

   - Add a nav item in `widgets/app-layout/model/nav-config.tsx` with `to: "/reports"`.
   - Add a TanStack route in `app/App.tsx` similar to how `SectionPage` is wired today, or point `/reports` to the dedicated `ReportsPage`.

---

## 7. Coding Guidelines

- **FSD discipline**
  - Only import through slice `index.ts` public APIs.
  - Push shared logic down to `entities` or `shared` when reused across features.
- **State**
  - Use TanStack Query for anything coming from the server.
  - Use Zustand for domain/global UI state (session, theme, global loading, sidebar).
- **UI**
  - Keep components “dumb” where possible; move side effects and data fetching into `model`/`api`.
  - Use Tailwind semantic tokens; avoid hard‑coded hex colors.
- **Routing**
  - Define new routes in `app/App.tsx` with TanStack Router.
  - Prefer `<Link>` and `useNavigate()` from TanStack Router instead of manual `window.location`.
- **Quality**
  - Run `npm run lint` (or `make lint`) before pushing.
  - Keep TSDoc up to date on exported hooks, components, and services that are reused across slices.

---

## 8. Backend API client generation

This project includes a generator that produces a fully typed backend API client from the Swagger/OpenAPI spec used by the CMS.

- **Entry point**
  - `make generate-api`
- **Configuration**
  - `API_DOC_URL` – set in `.env` (Swagger doc URL).
  - `API_TAGS` – default tag list lives in `Makefile`, can be overridden per-run:
    - `make generate-api API_TAGS="Operators / Auth,Files"`
  - `API_GROUPS` (optional) – group multiple Swagger tags into single modules.
- **Output (gitignored)**
  - `src/shared/api/generated/types/shared.ts` – shared models (`BaseResponse<T>`, `PaginationResponse<TItem>`, enums, common DTOs).
  - `src/shared/api/generated/types/*.ts` – per-tag/per-group models and pagination aliases (`XPagination`, `XPaginationResponseDTO`).
  - `src/shared/api/generated/clients/*.ts` – per-tag/per-group API functions.
  - `src/shared/api/generated/index.ts` – public barrel exports.

See `scripts/generate-api/README.md` for full details and advanced usage.

If you are unsure where to put new code, start from the FSD diagram above and choose the lowest possible layer that still makes sense. When in doubt, ask: “Is this business logic (feature/entity) or generic UI/util (shared)?”.

