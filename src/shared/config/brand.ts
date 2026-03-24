const DEFAULT_YOURPAY_DEV_LOGO_URL = "https://new-cms-stg.yourpay.co.id/images/logo-yourpay-dev.webp";

/**
 * Brand logo URL used across app shell and auth screens.
 * Can be overridden via `VITE_BRAND_LOGO_URL`.
 */
export const BRAND_LOGO_URL = import.meta.env.VITE_BRAND_LOGO_URL ?? DEFAULT_YOURPAY_DEV_LOGO_URL;
