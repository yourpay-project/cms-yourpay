const COOKIE_ACCESS = "access_token";
const COOKIE_REFRESH = "refresh_token";

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)"
    )
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function setCookie(
  name: string,
  value: string,
  maxAgeSeconds = 60 * 60 * 24 * 7
): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

export function getDefaultAccessToken(): string | null {
  return getCookie(COOKIE_ACCESS);
}

export function getDefaultRefreshToken(): string | null {
  return getCookie(COOKIE_REFRESH);
}

export function setTokensInCookies(
  access: string,
  refresh?: string,
  accessMaxAgeSeconds?: number
): void {
  setCookie(COOKIE_ACCESS, access, accessMaxAgeSeconds ?? 60 * 15);
  if (refresh) setCookie(COOKIE_REFRESH, refresh, 60 * 60 * 24 * 7);
}

export function clearTokensInCookies(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_ACCESS}=; path=/; max-age=0`;
  document.cookie = `${COOKIE_REFRESH}=; path=/; max-age=0`;
}

