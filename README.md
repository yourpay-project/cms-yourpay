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
│   ├── data-table/         # Legacy table (TanStack + subcomponents; for custom layouts)
│   │   ├── ui/DataTable.tsx, DataTableHead, DataTableBody, DataTablePagination
│   │   ├── model/data-table-types.ts, use-data-table-instance.ts
│   │   └── index.ts
│   └── user-table/         # Customer list table (uses shared DataTable)
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
    ├── config/              # UI-agnostic app configuration
    │   ├── navigation.ts    # navGroups + getNavTitle (no React deps)
    │   └── index.ts
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
    └── ui/                  # shadcn/ui facade + enterprise DataTable
        ├── button.tsx
        ├── card.tsx
        ├── data-table/      # Generic DataTable (AntD-style): pinning, selection, scroll shadow
        │   ├── ui/          # DataTable, DataTablePagination, DataTableToolbar, etc.
        │   ├── lib/         # table-utils (getPinningStyles, useScrollShadow), data-table-types
        │   └── index.ts
        ├── dropdown-menu.tsx
        ├── input.tsx
        ├── skeleton.tsx
        ├── page-skeleton.tsx
        ├── theme-toggle.tsx
        ├── table.tsx        # Table primitives (TableHeader, TableRow, TableHead, TableCell)
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

- Defines the route tree using `createRootRoute` and `createRoute` (wired via `app/router/router-instance.tsx`).
- Uses TanStack Router `lazyRouteComponent` to code-split route-level pages from `pages/*` via their public APIs (`index.ts`).
- Wraps everything in:
  - `QueryClientProvider` (TanStack Query)
  - `RouterProvider` (TanStack Router)
  - `ThemeProvider` and `Toaster`
  - Key routes:
  - `/` → `DashboardRoutePage` (page-level wrapper that applies `AppLayout` + auth gating).
  - `/login` → `LoginRoutePage`.
  - `/login/callback` → `LoginCallbackRoutePage` (Google OAuth callback).
  - `/customers` → `UserListRoutePage`.
  - Other sidebar routes (e.g. `/identity-access`) use `SectionRoutePage` placeholder.

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
  - Renders navigation groups from `model/nav-config.tsx` (which maps icons onto `shared/config` navigation data).
  - Respects RBAC via `useCan`.
  - Supports:
    - **Pinned section** (max 5 items) that stays fixed at the top.
    - **Search** input (with icon) for filtering non‑pinned items by label.
    - Collapsed mode (icons only) while preserving pin state.
- `model/nav-config.tsx`
  - UI-ready config for sidebar sections and items (adds icons).
  - Underlying routes/labels/permissions live in `shared/config/navigation.ts` to avoid layer leakage.
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
  - `loading-store.ts` – `useLoadingStore` for global loading flags (read in `Nav`).
  - `use-sync-global-loading.ts` – `useSyncGlobalLoading(loading)` syncs a page’s main query `isLoading` to the global store so the nav shows the spinner during initial data load.
  - `env.ts` – `validateEnv()` validates Vite env vars with Zod at startup (called in `main.tsx`).
  - `theme-store.ts` – `useThemeStore` for app theme.
  - `use-theme-effect.ts` – applies theme to `document.documentElement` and listens to system changes.
- `shared/ui/*`
  - shadcn/ui components wired with Tailwind theme tokens (Button, Card, DropdownMenu, Input, Skeleton, PageSkeleton, ThemeToggle, **Table** primitives).
  - **RouteFallback** – full-page loading fallback for `Suspense` when lazy-loading route components.
  - **ErrorBoundary** – isolates widget/page crashes to prevent total app failure.

### 5.5 Data tables (shared/ui/data-table, widgets/user-table)

The primary table for the app is the **shared DataTable** (`shared/ui/data-table`). It uses **@tanstack/react-table** with **semantic Tailwind tokens** (`bg-background`, `text-foreground`, `border-border`, `bg-muted`, `bg-card`) so it respects light/dark theme and stays consistent with the rest of the UI.

- **`shared/ui/data-table`** – generic, enterprise-style DataTable (AntD-like):
  - **DataTable** – main component: sticky header, column pinning (freeze left/right), scroll shadow (theme-aware), row selection (cross-page, invert, conditional), expandable rows, summary footer, empty/loading states, `onCell`/`onRow` for colSpan/rowSpan and a11y.
  - **Styling:** Header uses `bg-muted/80`, body uses `bg-background` with `hover:bg-muted/40`, borders use `border-border`. Pinned-column shadows use CSS classes `data-table-shadow-left` / `data-table-shadow-right` (defined in `src/index.css`) so they adapt to theme.
  - **Pagination:** Client-side by default; for server-side pass `pagination`, `pageCount`, and `onPaginationChange`.
  - **Exports:** `DataTable`, `DataTablePagination`, `DataTableToolbar`, `DataTableSummary`, `DataTableEmpty`, `DataTableLoadingOverlay`, `DataTableHeaderCell`, `createSelectionColumn`, `getPinningStyles`, `useScrollShadow`, and types from `@/shared/ui` or `@/shared/ui/data-table`.
- **`widgets/user-table`** – `UserTable` uses the shared `DataTable` with customer columns, name pinned left, actions pinned right, and server-side pagination; used by the user-list page at `/customers`.
- **`widgets/data-table`** – legacy table with `useDataTableInstance`, `DataTableHead`, `DataTableBody`, for custom layouts that need full control over table markup.
- **`entities/user`** – `User` type and `useUsersQuery`; responses validated with Zod in `model`.
- **`pages/user-list`** – `UserListPage` at `/customers`: `useUserListQuery`, filters, and `UserTable`.

Example – use the shared DataTable (recommended):

```tsx
import { DataTable, createSelectionColumn } from "@/shared/ui";

const columns = [
  { id: "name", header: "Name", cell: ({ row }) => row.original.name },
  createSelectionColumn(),
  { id: "actions", header: "", cell: () => <Button size="sm">View</Button> },
];

<DataTable
  columns={columns}
  data={rows}
  getRowId={(row) => row.id}
  initialColumnPinning={{ left: ["name"], right: ["actions"] }}
  scrollHeight="calc(100vh - 280px)"
  empty={{ emptyMessage: "No data." }}
/>
```

Example – server-side pagination:

```tsx
<DataTable
  columns={columns}
  data={currentPageRows}
  pagination={{ pageIndex, pageSize }}
  pageCount={Math.ceil(total / pageSize)}
  onPaginationChange={({ pageIndex, pageSize }) => { setPageIndex(pageIndex); setPageSize(pageSize); }}
/>
```

### 5.6 Loading: global, local, and lazy loading

- **Lazy loading (route/code-split)**  
  Page components (Dashboard, Login, UserList, etc.) are loaded with `React.lazy` and wrapped in `<Suspense fallback={<RouteFallback />}>`. The initial bundle stays smaller; the nav and layout load first, then the page chunk loads and the fallback is shown until the component is ready.

- **Global loading**  
  For the **first load of a page’s main data** (e.g. the initial query that fills the screen), call `useSyncGlobalLoading(isLoading)` from TanStack Query’s `isLoading`. The Nav shows the global spinner (Loader2) while that query has no data yet. When the page unmounts, global loading is cleared.

- **Local loading**  
  For **pagination refetch** or **in-place mutations**, keep loading local to the component:
  - **Tables:** Prefer content-level indicators (e.g. a small spinner near the page title) during pagination refetch. Avoid stacking multiple loading UIs when the page already renders a skeleton for the initial load.
  - **Mutations (PUT/PATCH, etc.):** Use the mutation’s `isPending` and show `Loader2` on the submit button and disable it (per coding guidelines).

- **Page skeleton**  
  When the main query has no data yet (`isLoading`), the page can render `PageSkeleton` (or similar) so the layout is visible and the content area shows a skeleton instead of a blank space. Global loading in the Nav still gives a single place to see that something is loading.

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
   import { reportRowSchema, type ReportRow } from "@/entities/report";

   export const fetchReports = async (signal?: AbortSignal): Promise<ReportRow[]> => {
     const res = await apiClient.get<unknown>("reports", { signal });
     return reportRowSchema.array().parse(res.data);
   };
   ```

3. **Add hooks in `features/reports/model`**

   ```ts
   // src/features/reports/model/use-reports.ts
   import { useQuery } from "@tanstack/react-query";
   import { fetchReports } from "../api/reports-service";

   export const useReports = () =>
     useQuery({
       queryKey: ["reports"],
       queryFn: ({ signal }) => fetchReports(signal),
     });
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

   - Add/modify a nav item in `shared/config/navigation.ts` (UI-agnostic) with `to: "/reports"`.
   - If the sidebar needs an icon, map its `iconKey` in `widgets/app-layout/model/nav-config.tsx`.
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
  - Use Tailwind **semantic tokens** only: `bg-background`, `text-foreground`, `border-border`, `bg-muted`, `text-muted-foreground`, `bg-card`, etc. Avoid hard‑coded hex so components respect light/dark theme. DataTable and shared UI follow this.
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
  - `VITE_API_DOC_URL` – set in `.env` (Swagger doc URL).
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

