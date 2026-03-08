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
