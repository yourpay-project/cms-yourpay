# YourPay CMS (React + Vite)

YourPay CMS is an internal console for content, operations, and reporting, built with **React 19**, **Vite**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **TanStack Query/Router**, **Framer Motion**, and **Zustand**.
The codebase follows **Feature‑Sliced Design (FSD)** as enforced by `.cursorrules`.

This document is written for **new engineers** joining the project. It explains how the repository is structured, how data and routing work, and how to safely add new features.

---

## 1. How to get started

End-to-end path for a new machine:

1. Install **Git** (to clone the repo).
2. Install **Node.js 25.x** (this repo pins **v25.7.0** in [`.nvmrc`](./.nvmrc)) and **npm 11.x** — either with **nvm** (recommended) or the **official Node.js installer**.
3. Clone the repo, install dependencies, copy **`.env`**, run the dev server.

---

### Prerequisites (what you need)

| Tool | Why |
|------|-----|
| **Git** | Clone and update the repository. |
| **Node.js 25.7+** | Runtime for Vite and the toolchain (see `.nvmrc`). |
| **npm 11.10+** | Installs packages (bundled with Node 25; verify with `npm -v`). |

Optional but recommended: **[nvm](https://github.com/nvm-sh/nvm)** (macOS/Linux) or **[nvm-windows](https://github.com/coreybutler/nvm-windows)** so the whole team can pin the same major Node version via [`.nvmrc`](./.nvmrc).

---

### Step 0 — Install Git (if you do not have it)

- **macOS:** Install [Xcode Command Line Tools](https://developer.apple.com/download/all/) (`xcode-select --install`) or Git via Homebrew (`brew install git`).
- **Windows:** Install [Git for Windows](https://git-scm.com/download/win).
- **Linux (Debian/Ubuntu):** `sudo apt update && sudo apt install git`

Check:

```bash
git --version
```

---

### Step 1 — Install Node.js

Pick **one** of the following.

#### Option A — Node via nvm (recommended)

Use this if **nvm is not installed yet** (or you want version switching per project).

**macOS / Linux ([nvm](https://github.com/nvm-sh/nvm#installing-and-updating))**

1. Run the **current** install one-liner from the [nvm README “Installing and updating”](https://github.com/nvm-sh/nvm#installing-and-updating) section (it may look like `curl … | bash` or `wget … | bash`). That downloads and configures nvm under `~/.nvm`.
2. **Reload your shell** so `nvm` is available:
   - Close and reopen the terminal, **or**
   - Run `source ~/.nvm/nvm.sh` (usual path after the official install script), **or**
   - Follow the post-install snippet the installer prints (it often appends `NVM_DIR` and a `source` line to `~/.bashrc` / `~/.zshrc`).
3. Verify:

```bash
command -v nvm   # should print "nvm", or run: nvm -v
```

If you see `command not found: nvm`, the shell did not load nvm yet — fix your profile file or open a new terminal, then try again.

**macOS — nvm via Homebrew (optional)**

If you already use [Homebrew](https://brew.sh), you can install nvm with the formula instead of the curl script:

```bash
brew install nvm
```

Homebrew does not load nvm automatically. Create the version directory and add the lines below to `~/.zshrc` (or `~/.bash_profile` if you use bash).  
`$(brew --prefix nvm)` resolves to the correct path on both Apple Silicon (`/opt/homebrew/...`) and Intel (`/usr/local/...`).

```bash
mkdir -p ~/.nvm

export NVM_DIR="$HOME/.nvm"
[ -s "$(brew --prefix nvm)/nvm.sh" ] && \. "$(brew --prefix nvm)/nvm.sh"
[ -s "$(brew --prefix nvm)/etc/bash_completion.d/nvm" ] && \. "$(brew --prefix nvm)/etc/bash_completion.d/nvm"
```

Then run `source ~/.zshrc` (or open a new terminal) and check `nvm -v`. After that, use `nvm install` / `nvm use` in the project root as usual.

**Windows ([nvm-windows](https://github.com/coreybutler/nvm-windows))**

1. Uninstall any standalone “Node.js” from *Apps & features* if you previously installed it manually (nvm-windows manages Node).
2. Download and run the **nvm-setup** installer from the [nvm-windows releases](https://github.com/coreybutler/nvm-windows/releases) page.
3. Open a **new** Command Prompt or PowerShell and verify: `nvm version`

Then, in **this repo’s root** (after you have cloned it):

```bash
nvm install    # uses .nvmrc on macOS/Linux nvm; if your Windows nvm ignores it, run: nvm install 25.7.0
nvm use
node -v      # expect v25.7.x (or newer matching .nvmrc)
npm -v       # expect 11.10.x or higher
```

On **nvm-windows**, if `nvm install` does not read `.nvmrc`, run `nvm install 25.7.0` then `nvm use 25.7.0`.

#### Option B — Node without nvm

1. Download the **Current** **25.x** installer from [https://nodejs.org](https://nodejs.org) (or install the exact version from [releases](https://nodejs.org/en/download/current)) and install it.
2. Open a new terminal and confirm:

```bash
node -v   # v25.7.x or higher (match .nvmrc when possible)
npm -v    # 11.10.x or higher
```

You can develop the CMS this way; you only lose easy per-project version switching.

---

### Step 2 — Clone and first-time setup

```bash
git clone <repository-url> yourpay-cms
cd yourpay-cms
nvm use                    # only if you use nvm (after install / use steps above)
npm install
cp .env.example .env       # edit API URL and other values (see Environment Variables)
```

---

### Step 3 — Run the app locally

```bash
npm run dev
# or
make run
```

The Vite dev server prints a local URL (commonly `http://localhost:5173`). Use that in the browser. Set `VITE_API_BASE_URL` in `.env` to a reachable API if you need live data.

### Everyday commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` or `make run` |
| Lint | `npm run lint` or `make lint` |
| Production build | `npm run build` or `make build` |
| Preview production build | `npm run preview` |

---

## 2. Tech Stack Overview

- **Runtime / Framework**
  - React 19
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

## 3. Project Structure (FSD)

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
│   ├── user-list/
│   │   ├── ui/UserListPage.tsx
│   │   └── index.ts
│   ├── user-detail/
│   │   ├── ui/UserDetailPage.tsx
│   │   └── index.ts
│   ├── countries/           # Master Data → Countries (API)
│       ├── ui/CountriesRoutePage.tsx
│       ├── ui/CountriesPage.tsx
│       └── model/           # useCountriesFilters, useCountryForm
│   └── fee-config/          # Exchange & Fee Management → Fee Config (API-backed)
│       ├── ui/FeeConfigRoutePage.tsx
│       ├── ui/FeeConfigPage.tsx
│       └── model/           # useFeeConfigFilters, feeConfigFormSchema
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
│   ├── user-table/         # Customer list table (uses shared DataTable)
│   │   ├── ui/UserTable.tsx
│   │   └── index.ts
│   └── modal-manager/      # Global modal orchestrator (lazy, centralized)
│       ├── model/modal-registry.ts, prefetch-modal.ts
│       ├── ui/ModalContainer.tsx
│       ├── ui/types.ts, ui/KycVerificationCheckItem.tsx
│       ├── ui/KycEnableEditConfirm.tsx, ui/KycGenerateOcrConfirm.tsx, ui/KycVerificationCheck.tsx
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
│   ├── user/
│   │   ├── model/types.ts   # User
│   │   ├── api/use-users-query.ts
│   │   └── index.ts
│   └── country/
│       ├── model/model.ts   # Country schema + CountriesResponse
│       ├── api/use-countries-query.ts  # GET v1/operators/countries (Operator Countries tag)
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
    └── ui/                  # shadcn/ui facade + enterprise inputs & DataTable
        ├── button.tsx
        ├── card.tsx
        ├── data-table/      # Generic DataTable (AntD-style): pinning, selection, scroll shadow
        │   ├── ui/          # DataTable, DataTableScrollArea, DataTableHeader, DataTableBody, Pagination, etc.
        │   ├── lib/         # use-data-table, data-table-constants, table-utils, data-table-types
        │   └── index.ts
        ├── dropdown-menu.tsx
        ├── input/           # Floating-label Input slice (FSD, variants + hooks)
        ├── input.tsx        # Legacy alias kept for backwards-compat imports
        ├── search-input.tsx # Generic SearchInput used across list pages
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

## 4. Running the app (reference)

Requirements, nvm usage, install steps, and commands are documented in **[How to get started](#1-how-to-get-started)** above. Use this section only if you need a minimal reminder:

```bash
npm install
cp .env.example .env
npm run dev
```

---

## 5. Environment Variables

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

## 6. Architecture for New Engineers

### 6.1 Routing (TanStack Router)

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
  - `/customers/$customerId` → `UserDetailRoutePage`.
  - Other sidebar routes (e.g. `/identity-access`) use `SectionRoutePage` placeholder.

For navigation inside components, use **TanStack Router hooks**:

- `useNavigate()` – navigate by `to: "/path"`.
- `Link` – for declarative navigation from the sidebar.

### 6.2 Auth & Session

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

- `LoginCard` – card-based login composition with explicit responsibility split: `LoginHeader` (logo + sign in title), `LoginForm` (email/password + sign-in button + `or` divider), `LoginWithGoogle`, `LoginInfo` (operator-only notice), and `LoginFooter` (centered theme switch + company/version info).
- `ProtectedRoute` – renders children only when authenticated; otherwise navigates to `/login`.
- `LoginRedirect` – for `/login`; if already authenticated, redirects to `/`.
- `Can` – conditional renderer based on permissions/roles (wrapping `useCan`).

### 6.3 Layout & Sidebar (widgets/app-layout)

- `ui/AppLayout.tsx`
  - Top nav (`Nav`), left sidebar (`Sidebar`), and main content area (`min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden`) so pages like KYC detail can use `flex-1 min-h-0` + inner `overflow-y-auto` for a fixed page header and scrollable cards.
  - Receives optional `navTitle` and `children`.
- `ui/Nav.tsx`
  - App title, global loading indicator, sidebar toggle, theme toggle, and user menu (email + logout).
- `ui/MobileSidebar.tsx`
  - Mobile overlay sidebar with `framer-motion` enter/exit animation (backdrop fade + panel slide).
- `ui/Sidebar.tsx`
  - Renders navigation groups from `model/nav-config.tsx` (which maps icons onto `shared/config` navigation data).
  - Respects RBAC via `useCan`.
  - Uses `framer-motion` width animation for smooth desktop collapse/expand.
  - Internally split into small UI sections (`SidebarDashboardSection`, `SidebarNavGroups`) and a layout resolver (`getSidebarLayoutView`) for readability.
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
    - `pinned: string[]`, `togglePinned(path)`; pinned entries are persisted and capped to 5 items.

**Page-level persisted filter state (separate localStorage keys):**

- **`pages/user-list/model/user-list-store.ts`** – `useUserListStore` persisted as `cms-user-yourpay`. Holds generic backend-driven `filterValues` (`Record<string,string>`), search, pagination, and filters card open state. Isolated from KYC state.
- **`pages/kyc-submission/model/kyc-submission-store.ts`** – `useKycSubmissionStore` persisted as `cms-kyc-submission`. Holds filters (status, document type, country, reverify, KYC/Last update date ranges), search, pagination, and filters card open state. Isolated from User Yourpay state.

### 6.4 Shared Layer

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
  - `format-display-datetime.ts` – `formatDisplayDate()` / `formatDisplayDateTime()` for consistent date + datetime display across pages (e.g. `June 24, 2025`, `Aug 08, 2022 11:53AM`).
  - `env.ts` – `validateEnv()` validates Vite env vars with Zod at startup (called in `main.tsx`).
  - `theme-store.ts` – `useThemeStore` for app theme.
  - `use-theme-effect.ts` – applies theme to `document.documentElement` and listens to system changes.
  - `modal/*` – centralized modal contract + store (`ModalRegistryProps`, `ModalType`, `useModalStore`).
- `shared/ui/*`
  - shadcn/ui components wired with Tailwind theme tokens (Button, Card, DropdownMenu, Input, Skeleton, PageSkeleton, ThemeToggle, **Table** primitives).
  - `tooltip.tsx` – shared Tooltip primitives (`TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent`) used for consistent hover/focus hints across the app.
  - `image-with-loader.tsx` – `ImageWithLoader` wrapper to standardize skeleton-first image rendering until the image loads.
  - **RouteFallback** – full-page loading fallback for `Suspense` when lazy-loading route components.
  - **ErrorBoundary** – isolates widget/page crashes to prevent total app failure.

### 6.5 Data tables (shared/ui/data-table, widgets/user-table)

The primary table for the app is the **shared DataTable** (`shared/ui/data-table`). It uses **@tanstack/react-table** with **semantic Tailwind tokens** (`bg-background`, `text-foreground`, `border-border`, `bg-muted`, `bg-card`) so it respects light/dark theme and stays consistent with the rest of the UI.

- **`shared/ui/data-table`** – generic, enterprise-style DataTable (AntD-like), split into small parts for readability:
  - **DataTable** – thin main component: uses `useDataTable` hook and composes `DataTableScrollArea` and pagination.
  - **useDataTable** – central hook: table state, `useReactTable` instance, scroll shadow, derived values (empty message, title/footer nodes, etc.). Export for advanced or custom table UIs.
  - **DataTableScrollArea** – scroll wrapper + table shell + `DataTableHeader`, `DataTableBody`, footers, and fixed bottom shadow overlay. Accepts `scrollHeight` (e.g. `TABLE_BODY_VIEWPORT_HEIGHT`) to cap the visible body height; content scrolls inside when rows exceed that height. When data is empty or few rows, the area is content-sized (no extra empty space).
  - **Viewport height:** Use `scroll={{ y: TABLE_BODY_VIEWPORT_HEIGHT }}` (or a custom CSS height string). The constant `TABLE_BODY_VIEWPORT_HEIGHT` (`"480px"`) gives a fixed viewport of ~10 rows: empty/few rows use only the space needed; many rows (e.g. 50) scroll inside the same viewport. Export from `@/shared/ui`.
  - **DataTableHeader** – sticky thead with pinning and scroll shadow classes; **DataTableBody** – tbody with loading/empty/rows and expandable support.
  - `DataTableBody` internals are split into focused units (`DataTableBodyRow`, `data-table-body-view-model`) so the main body component stays orchestration-focused.
  - **Vertical scroll shadow:** Set `enableVerticalShadow` to show a top shadow when scrolled down and a bottom shadow when there is content below. The bottom shadow is an overlay fixed at the viewport bottom (does not scroll with rows) and hides when the user scrolls to the very bottom.
  - **Styling:** Header uses `bg-muted`, body uses `bg-background` with `hover:bg-muted/40`, borders use `border-border`. Pinned-column shadows use CSS classes `data-table-shadow-left` / `data-table-shadow-right` (defined in `src/index.css`).
  - **Pagination:** Client-side by default; for server-side pass `pagination`, `pageCount`, and `onPaginationChange`. The "X of Y row(s) selected." line is shown only when the table uses row selection (`selection` with `enableRowSelection`); otherwise the pagination controls stay right-aligned.
  - **Exports:** `DataTable`, `useDataTable`, `DataTablePagination`, `DataTableToolbar`, `DataTableSummary`, `DataTableEmpty`, `DataTableLoadingOverlay`, `DataTableHeaderCell`, `createSelectionColumn`, `getPinningStyles`, `useScrollShadow`, `TABLE_BODY_VIEWPORT_HEIGHT`, and types from `@/shared/ui` or `@/shared/ui/data-table`.
  - **Selection column:** `createSelectionColumn` and `SELECTION_COLUMN_ID` are in `lib/selection-column.ts`; header/cell UI in `ui/selection-column-components.tsx` (split for fast refresh).
- **`widgets/user-table`** – `UserTable` uses the shared `DataTable` with customer columns, name pinned left, actions pinned right, server-side pagination, and `scroll={{ y: TABLE_BODY_VIEWPORT_HEIGHT }}`; used by the user-list page at `/customers`.
- **`pages/user-detail`** – Customer detail page at `/customers/$customerId`: fetches `GET v1/operators/customers/{customer_id}`, renders top action buttons and collapsible cards; includes lazy-loaded modals for **Edit Identity Access** (`GET v1/operators/identity-accesses`), **View Devices** (`GET v1/operators/customers/{customer_id}/devices`), **View Wallets** (`GET v1/operators/customers/{customer_id}/wallets`), **Block/Unblock User** (`POST v1/operators/customers/{customer_id}/status`), and **Close User** (confirmation form modal). Modal loading uses a lightweight Lucide spinner fallback and `useLazyModal` strategy (lazy load on first open, keep mounted afterwards) so animation remains smooth while still reducing initial route payload. The page is split into composer sections (`UserDetailPageHeader`, `UserDetailCardsSection`, `user-detail-page-view-model`) for readability and maintainability.
- **`widgets/data-table`** – legacy table with `useDataTableInstance`, `DataTableHead`, `DataTableBody`, for custom layouts that need full control over table markup.
- **`entities/user`** – `User` type and `useUsersQuery`; responses validated with Zod in `model`.
- **`entities/indonesia-address`** – Zod-validated fetches for `v1/provinces`, `v1/cities`, `v1/districts`, `v1/sub-districts` and `useIndonesiaAddressMasterQueries` for cascading Indonesia address UI.
- **`entities/occupation`** – Zod-validated `GET v1/occupations` and `useOccupationsQuery` for KYC document occupation dropdown.
- **`pages/user-list`** – `UserListPage` at `/customers`: `useUserListFilters` backed by `useUserListStore` (persisted as `cms-user-yourpay`), dynamic filter mapping from backend `filters` metadata (`control`, `options`, `date_range`), shared collapsible filter card (`shared/ui/filter-card.tsx`), control buttons row (e.g. country), search, badges via `shared/lib/filter-badge-colors`, and `UserTable`.
- **`pages/kyc-submission`** – KYC Submissions page: `useKycSubmissionFilters` backed by `useKycSubmissionStore` (persisted as `cms-kyc-submission`), shared collapsible filter card (`shared/ui/filter-card.tsx`) rendered from backend `filters` metadata (`options` + `date_range` labels), search and `KycSubmissionTable`. Option filter values and badges are normalized from the verification-submissions payload.
- **`pages/transactions`** – Transactions list page at `/transactions`: SDUI filters from `GET v1/operators/transactions` (`filterDefinitions`: `options`, optional `control`, `date_range` e.g. `transaction_date`). Uses shared filter card (`shared/ui/filter-card.tsx`) plus `FilterControlButtons` and `DateRangePicker`; `useTransactionsStore` persists as `cms-user-transactions`; debounced `keyword` search; `TransactionTable` opens detail via explicit `Actions -> View` button (row click disabled), and supports double-click copy for Transaction ID. `TransactionTableColumns` internals are split into focused UI components (`TransactionIdHeader`, `TransactionIdCell`) while pure derivation logic lives in `widgets/transaction-table/model/transaction-utils.ts`.
- **`pages/transaction-detail`** – Transaction detail page at `/transactions/$id`: fetches `GET v1/operators/transactions/{id}` and renders read-only sections (basic information, transaction details, parties, references, timestamps) with a back action to list. The page is intentionally split into small composable units (`TransactionDetailHeader`, `TransactionDetailSectionsCard`, `transaction-detail-view-model`) so route file stays orchestration-only and readable.
- **`pages/kyc-submission-detail`** – KYC submission detail at `/kyc-submission/$id`: route wraps content in `flex-1 min-h-0` so the **page title row** (back + title + status) stays fixed while content cards scroll below. **`<xl`** single column (submission, EPL, images). **`xl+`** two columns — user data left, `w-96` document images right with independent internal scrolling and top/bottom scroll-shadows. UI is split into `KycSubmissionDetailPageHeader` + `KycSubmissionDetailPageRightColumn` for readability. **Document Images** now behaves conditionally: if image missing -> show `FileDropzone`; if image exists -> show preview with overlay controls (zoom in/out, rotate, reset/home, edit), click-to-open large modal, plus **Compare** action to open side-by-side (desktop) / stacked (mobile) comparison modal. Save/status/checks as per API. **Document information** (document type/number, passport dates, occupation/ARC) and **Verification checks** are composed from smaller sections with payload normalization in model hooks (`use-kyc-document-information-card-logic`, `use-verification-check-items`). **ID** address: `entities/indonesia-address`.
- **`pages/kyc-submission-detail`**: The **Document Images card** is intentionally split into small UI sections (`DocumentImagesCardHeader`, `DocumentImagesCardBody`, `DocumentImagesCardFooter`) to keep each file within the repo’s size guidelines while preserving the same behavior and layout.
- **`widgets/modal-manager`**: KYC image single-preview modal content is composed into a dedicated image-content section and a drag-scroll viewport, with class composition through `cn()` and zoom-safe dynamic transform styles.

**Filter badges and shared filter UI:**

- **`shared/lib/filter-badge-colors.ts`** – `getFilterBadgeClassName(key)` returns distinct Tailwind classes per filter key (status, country, documentType, kyc, gender, etc.) for consistent badge styling across KYC and User Yourpay.
- **`shared/ui/filter-card.tsx`** – single source-of-truth collapsible filter card header (toggle, badges, reset). Includes shared badge mappers `toFilterCardBadges` and `toFilterCardBadgeLabel` so each page only adapts its local badge model once.
- **`shared/ui/dropdown-field-trigger.tsx`** – Generic field trigger wrapper (leading/trailing slots, default chevron) used by dropdown and select-like controls so label and chevron stay in one clickable button area.
- **`shared/ui/filter-select-with-clear.tsx`** – Reusable filter row: native select with `DropdownFieldTrigger` visual wrapper plus clear (X) behavior; used inside KYC and User Yourpay filter cards.
- **`shared/ui/filter-controls.tsx`** – Generic backend-driven filter renderer primitives: `FilterControlButtons` (button/tabs style controls) and `FilterOptionsGrid` (select-with-clear grid for options filters).
- **`shared/ui/select-dropdown.tsx`** – Generic dropdown selector with optional `searchable` mode. When `searchable` is true, it renders a search input and filters options by value/label/description. Reusable for status/reason pickers and other forms. Editable state uses subtle hover/focus background, while disabled/read-only state keeps static background and blocked interactions.
- `SelectDropdown` internals are split into focused sections (`SelectDropdownMenuContent`, `SelectDropdownClearButton`, `select-dropdown-view-model`) to keep parent rendering orchestration-only.
- **`shared/ui/labeled-select-field.tsx`** – Generic composition for `label + optional required star + SelectDropdown`, used to remove repeated field markup in KYC detail forms.
- **`shared/ui/input`** – Floating-label input primitives with consistent state UX: editable inputs use subtle hover + focus cues, while read-only/disabled inputs use `not-allowed` cursor and avoid interactive background changes.
- **`shared/ui/file-dropzone.tsx`** – Generic drag-and-drop file area (native `<input type="file" />`, dashed border, design tokens). Used on `pages/kyc-submission-detail` for ID/selfie uploads until an API is wired.
- **`shared/ui/image-viewer`** – `ImageViewerFrame` and `ImageViewerToolbar` provide a standardized image preview layout with built-in zoom, rotate, and reset actions. The floating toolbar is automatically centered, and supports an optional `onEdit` callback to seamlessly show/hide an update action inside the toolbar.
**Calendar and date picker:**

- **`shared/ui/calendar.tsx`** – shadcn-style Calendar (react-day-picker) with optional month/year dropdown (`captionLayout="dropdown"`). Used by KYC date range picker in `pages/kyc-submission` and the single-date birth field on `pages/kyc-submission-detail`.
- **`shared/ui/date-picker.tsx`** and **`shared/ui/date-range-picker.tsx`** – generic dropdown-calendar pickers used by KYC filters and KYC detail fields (Birth Date + date ranges). These keep the filter UI consistent across the app, centralize date formatting/clearing behavior, and remove sticky focus-ring after popup close.
- `DatePicker` internals are split into focused parts (`date-picker-menu-content`, `date-picker-view-model`) to keep the parent component orchestration-focused and easier to maintain.
- `DateRangePicker` also uses a dedicated view-model helper (`date-range-picker-view-model`) to centralize display text and range parsing logic.
- **`shared/ui/badge.tsx`** – semantic status badge with low-glare color density for long-session readability (`default`, `success`, `warning`, `destructive`).

Example – use the shared DataTable (recommended):

```tsx
import { DataTable, createSelectionColumn, TABLE_BODY_VIEWPORT_HEIGHT } from "@/shared/ui";

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
  scroll={{ y: TABLE_BODY_VIEWPORT_HEIGHT }}
  enableVerticalShadow
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

### 6.6 Loading: global, local, and lazy loading

- **Lazy loading (route/code-split)**  
  Page components (Dashboard, Login, UserList, etc.) are loaded with `React.lazy` and wrapped in `<Suspense fallback={<RouteFallback />}>`. The initial bundle stays smaller; the nav and layout load first, then the page chunk loads and the fallback is shown until the component is ready.

- **Centralized modal lazy loading**  
  All global modals are mounted through `widgets/modal-manager/ui/ModalContainer.tsx` and injected once in `app/App.tsx`. Triggering happens with `useModalStore(state => state.openModal)` using typed keys from `shared/lib/modal`, while modal chunks are loaded on-demand via `React.lazy` and can be warmed with `prefetchModal(type)`.  
  The `ModalContainer` provides the shared `<Modal>` shell (Radix dialog + enter/exit animations) and injects open/close callbacks; individual modal modules are *content-only* (they render body/actions without their own `<Modal>` wrapper). Suspense fallback is rendered **inside** the modal shell so users instantly see the dialog frame while lazy content is loading. Shell sizing/title config is defined in `widgets/modal-manager/model/modal-registry.ts`, and dynamic runtime widths are applied via inline style (`maxWidth`) to avoid Tailwind JIT arbitrary-class traps. `Modal` internals are composed from focused UI sections (`ModalHeaderSection`, `ModalFooterSection`, `ModalCloseButton`) so the parent modal component remains orchestration-focused.
  Recent modal additions follow the same rule (e.g. `COUNTRIES_CREATE_EDIT_MODAL` and `KYC_DOCUMENT_IMAGES_*`).

- **Global loading**  
  For the **first load of a page’s main data** (e.g. the initial query that fills the screen), call `useSyncGlobalLoading(isLoading)` from TanStack Query’s `isLoading`. The Nav shows the global spinner (Loader2) while that query has no data yet. When the page unmounts, global loading is cleared.

- **Local loading**  
  For **pagination refetch** or **in-place mutations**, keep loading local to the component:
  - **Tables:** Prefer content-level indicators (e.g. a small spinner near the page title) during pagination refetch. Avoid stacking multiple loading UIs when the page already renders a skeleton for the initial load.
  - **Mutations (PUT/PATCH, etc.):** Use the mutation’s `isPending` and show `Loader2` on the submit button and disable it (per coding guidelines).

- **Page skeleton**  
  When the main query has no data yet (`isLoading`), the page can render `PageSkeleton` (or similar) so the layout is visible and the content area shows a skeleton instead of a blank space. Global loading in the Nav still gives a single place to see that something is loading.

---

## 7. How to Add a New Feature (Step‑by‑Step)

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

## 8. Coding Guidelines

- **FSD discipline**
  - Only import through slice `index.ts` public APIs.
  - Push shared logic down to `entities` or `shared` when reused across features.
- **Naming**
  - Prefer context-based component names and avoid redundant suffixes when context already implies type (e.g. inside `modal-manager/ui`, use `KycVerificationCheck` instead of `KycVerificationCheckModal`).
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

## 9. Backend API client generation

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

