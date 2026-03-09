# YourPay CMS (React + Vite)

YourPay CMS is an internal content and operations console built with **React 18**, **Vite**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **TanStack Query**, and **Zustand**.  
The codebase is structured using **Feature‑Sliced Design (FSD)** as enforced by `.cursorrules`.

## Tech Stack

- **App shell**: React 18, React Router v6, Vite
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS with semantic tokens (`bg-background`, `text-foreground`, etc.)
- **UI kit**: shadcn/ui, wrapped under `src/shared/ui`
- **Data fetching**: TanStack Query (`@tanstack/react-query`)
- **State management**: Zustand (`entities/*` for domain state, `shared/lib` for cross‑cutting state)
- **Notifications**: `sonner`
- **Icons**: `lucide-react`

## Project Structure (FSD)

All application code lives under `src/` and follows FSD.  
Layer import order: **`app → pages → widgets → features → entities → shared`**.

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
│   └── login-callback/
│       ├── ui/LoginCallbackPage.tsx
│       └── index.ts
├── widgets/                 # Large, reusable page sections
│   └── app-layout/
│       ├── ui/AppLayout.tsx
│       ├── ui/Nav.tsx
│       ├── ui/Sidebar.tsx
│       ├── model/nav-config.tsx
│       ├── model/sidebar-store.ts
│       └── index.ts
├── features/                # User interactions with business value
│   └── auth/
│       ├── ui/…             # LoginForm, ProtectedRoute, LoginRedirect, Can
│       ├── model/…          # Hooks (useAuth, useCan, useLoginMutation, …)
│       ├── api/auth-service.ts
│       ├── constants/demo-auth.ts
│       └── index.ts         # Public API for the auth feature
├── entities/                # Business entities and domain state
│   └── session/
│       ├── model/types.ts   # AuthUser, Role, Permission, JwtPayload
│       ├── model/auth-store.ts
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
        └── index.ts
```

### Import Rules

- **No deep imports across slices**. Always import from a slice’s `index.ts`.
  - ✅ `import { useAuth } from "@/features/auth";`
  - ❌ `import { useAuth } from "@/features/auth/model/use-auth";`
- **Layer direction**:
  - `app` may import from any other layer.
  - `pages` may import from `widgets`, `features`, `entities`, `shared`.
  - `widgets` may import from `features`, `entities`, `shared`.
  - `features` may import from `entities`, `shared`.
  - `entities` may import from `shared`.
  - `shared` is leaf; it does not import from higher layers.

## Running the App

Requirements:

- Node.js 20+
- npm 10+

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
# via npm
npm run dev

# or via Makefile shortcut
make run
```

Build for production:

```bash
npm run build
# or
make build
```

Preview the production build:

```bash
npm run preview
```

Run ESLint:

```bash
npm run lint
```

## Environment Variables

Configure these in `.env` (or `.env.local`), based on `.env.example`:

- `VITE_API_BASE_URL` – Base URL for the backend API (e.g. `https://api.yourpay.co.id` or `/api`).
- `VITE_GOOGLE_AUTH_URL` – Optional explicit URL for Google OAuth redirect; if omitted, the app derives it from `VITE_API_BASE_URL`.
- `VITE_APP_VERSION` – Displayed on the login page footer.

## Architecture Notes

### Auth Flow

- Email/password login calls `features/auth/api/auth-service.login`, which:
  - Sends `POST /auth/login` to the backend.
  - Stores access + refresh tokens in cookies via `shared/api`.
  - Returns the `AuthUser` payload.
- Session state is kept in `entities/session`:
  - `useAuthStore` (Zustand) stores `user`, `isAuthenticated`, and permission/role helpers.
- The `auth` feature exposes:
  - UI: `LoginForm`, `ProtectedRoute`, `LoginRedirect`, `Can`.
  - Hooks: `useAuth`, `useCan`, `usePermissions`, `useLoginMutation`, `useLogout`.
  - Service functions: `login`, `logout`, `getMe`, `getGoogleAuthUrl`, `setTokenFromCallback`.

### Theming

- Theme state is managed in `shared/lib/theme-store.ts` (`light | dark | system`).
- `useThemeEffect` syncs the resolved theme (`light`/`dark`) with `document.documentElement` and the OS preference.
- Components use semantic Tailwind tokens (e.g. `bg-background`, `text-foreground`, `border-border`) so light/dark modes remain consistent.

### API Client

- `shared/api/api-client.ts` provides:
  - `apiRequest` – core fetch wrapper with:
    - automatic Authorization header from access token,
    - 401 handling + optional refresh via `/auth/refresh`,
    - normalized error via `ApiClientError`.
  - `apiClient` – convenience methods (`get`, `post`, `put`, `patch`, `delete`).
  - Cookie helpers (`setTokensInCookies`, `clearTokensInCookies`).
- `shared/api/use-api-query.ts` wraps **TanStack Query** for simple REST patterns:
  - Accepts a `queryKey` and `path`,
  - Returns unwrapped `data` with loading/error states from TanStack.

## Coding Guidelines

- **Do not** import directly from deep feature/entity files; extend the slice’s `index.ts` instead.
- Prefer **TanStack Query** for server state and **Zustand** for domain/global state.
- Keep **UI components “dumb”**; move logic into `model` or `api` segments.
- Use Tailwind’s **semantic** color tokens; avoid hard‑coded colors (e.g. `bg-white`).
- When adding new slices:
  - Create `ui/`, `model/`, `api/` as needed.
  - Add `index.ts` as the single public entrypoint.

## Makefile Shortcuts

For convenience, you can use:

```bash
make run   # npm run dev
make build # npm run build
```

# YourPay CMS

React CMS dengan TypeScript, Tailwind, shadcn/ui, TanStack Query/Table. RBAC + JWT dengan auto refresh token dari cookie.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Struktur (sesuai .cursorrules)

- `src/components/ui` — komponen shadcn
- `src/components/shared` — layout (Sidebar, Nav, AppLayout), ThemeToggle, PageSkeleton
- `src/features/[feature]/` — hooks, services, types per fitur
- `src/lib` — api-client (JWT + refresh token), utils, use-api-query
- `src/store` — Zustand (theme, auth, loading)
- `src/types` — tipe global (auth/RBAC)

## Fitur

- **Theme**: Dark / Light / System (toggle di Nav)
- **RBAC**: `useAuth`, `usePermissions`, `useCan` — siap dipakai; BE menyusul untuk roles/permissions
- **HTTP API**: `apiClient` & `useApiQuery` — reusable, auto refresh token dari cookie
- **Loading**: `useLoadingStore` (global), Skeleton/PageSkeleton untuk UI

## Auth & Login

- **Login**: Form email/password + tombol "Sign in with Google". Email/password → `POST /auth/login` (body: `{ email, password }`); response: `{ access_token, refresh_token?, user }`. User disimpan di Zustand; token di cookie.
- **Google**: Tombol redirect ke `VITE_GOOGLE_AUTH_URL` atau `${VITE_API_BASE_URL}/auth/google`. Backend redirect ke Google lalu callback; callback redirect ke `/login/callback?token=...` (atau set cookie + redirect ke `/`). Halaman `/login/callback` baca token (jika ada), panggil `GET /auth/me`, set user, redirect ke `/`.
- **Protected route**: Semua route di bawah `/` butuh auth; bila belum login → redirect ke `/login`. Bila sudah login dan buka `/login` → redirect ke `/`.

## Sidebar & RBAC

- Menu sidebar diambil dari `src/config/nav-config.tsx` (group + item + permission). Item yang punya `permission` hanya tampil jika `useCan().can(permission)` true (super_admin atau permission `*` punya akses penuh). Tanpa BE, user kosong sehingga hanya "Dashboard" (tanpa permission) yang tampil.

## API Client

- Token: baca dari cookie `access_token` / `refresh_token`; refresh lewat `POST /auth/refresh` (body: `{ refresh_token }`).
- Set `VITE_API_BASE_URL` di `.env`. Panggil `initApiClient()` sekali di `main.tsx` (sudah dipasang).
