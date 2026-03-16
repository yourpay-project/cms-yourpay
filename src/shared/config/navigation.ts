export interface NavigationItemConfig {
  to: string;
  label: string;
  permission?: string;
  /**
   * Logical icon key used by UI layers (e.g., widgets) to attach an actual ReactNode icon.
   * Keeping this as data avoids shared/config depending on React.
   */
  iconKey?: string;
}

export interface NavigationGroupConfig {
  group?: string;
  items: NavigationItemConfig[];
}

/**
 * Global navigation configuration.
 *
 * - This file is intentionally UI-agnostic (no React imports).
 * - Widgets (e.g. sidebar) can map `iconKey` to actual icons in their own layer.
 */
export const navGroups: NavigationGroupConfig[] = [
  {
    items: [
      {
        to: '/',
        label: 'Dashboard',
        iconKey: 'dashboard',
      },
    ],
  },
  {
    group: 'User & Access Management',
    items: [
      {
        to: '/identity-access',
        label: 'Identity Access (API)',
        iconKey: 'identityAccess',
        permission: 'view_any_identity_access_resource',
      },
      {
        to: '/otp-logs',
        label: 'OTP Logs (API)',
        iconKey: 'otpLogs',
        permission: 'view_any_otp_logs_api_resource',
      },
    ],
  },
  {
    group: 'KYC & Verification',
    items: [
      {
        to: '/customers',
        label: 'User Yourpay',
        iconKey: 'users',
        permission: 'view_any_customers_resource',
      },
      {
        to: '/kyc-submission',
        label: 'KYC Submission',
        iconKey: 'kycSubmission',
        permission: 'view_any_kyc_submission_header_resource_api',
      },
    ],
  },
  {
    group: 'Transaction Management',
    items: [
      {
        to: '/transactions',
        label: 'Transactions (API)',
        iconKey: 'transactions',
        permission: 'view_any_transaction_api_transaction',
      },
      {
        to: '/wallet-transaction-controls',
        label: 'Wallet Transaction Controls (API)',
        iconKey: 'wallet',
        permission: 'view_any_wallet_transaction_control_resource',
      },
      {
        to: '/transaction-controls',
        label: 'Transaction Controls (API)',
        iconKey: 'settings',
        permission: 'view_any_transaction_control_api_transaction_control',
      },
    ],
  },
  {
    group: 'Content Management',
    items: [
      {
        to: '/video-tutorials',
        label: 'Video Tutorial (API)',
        iconKey: 'video',
        permission: 'view_any_video_tutorial_api_video_tutorial',
      },
      {
        to: '/video-categories',
        label: 'Video Category (API)',
        iconKey: 'video',
        permission: 'view_any_video_category_api_video_category',
      },
      {
        to: '/static-pages',
        label: 'Static Page',
        iconKey: 'otpLogs',
        permission: 'view_any_static_page_resource',
      },
    ],
  },
  {
    group: 'Voucher Management',
    items: [
      {
        to: '/vouchers',
        label: 'Voucher',
        iconKey: 'gift',
        permission: 'view_any_voucher_management_resource',
      },
      {
        to: '/disburse-voucher',
        label: 'Disburse Voucher',
        iconKey: 'creditCard',
        permission: 'view_any_disbursement_voucher_resource',
      },
    ],
  },
  {
    group: 'Marketing Configuration',
    items: [
      {
        to: '/scratch-cards',
        label: 'Scratch Card',
        iconKey: 'gift',
        permission: 'view_any_scratch_card_resource',
      },
    ],
  },
  {
    group: 'Reports & Analytics',
    items: [
      {
        to: '/report-dtva',
        label: 'DTVA Transaction',
        iconKey: 'chart',
        permission: 'view_any_report_dtva_resource',
      },
    ],
  },
  {
    group: 'Master Data',
    items: [
      {
        to: '/countries',
        label: 'Countries',
        iconKey: 'dashboard',
        permission: 'view_any_countries_api_resource',
      },
    ],
  },
  {
    group: 'Exchange & Fee Management',
    items: [
      {
        to: '/exchange-rates',
        label: 'Exchange Rates',
        iconKey: 'chart',
        permission: 'view_any_exchange_rates_resource',
      },
    ],
  },
  {
    group: 'Customer Management',
    items: [
      {
        to: '/balance-adjustments',
        label: 'Balance Adjustments',
        iconKey: 'wallet',
        permission: 'view_any_balance_adjustment_resource',
      },
    ],
  },
  {
    group: 'Partner & Service Management',
    items: [
      {
        to: '/system-services',
        label: 'System Service (API)',
        iconKey: 'settings',
        permission: 'view_any_system_service_api_resource',
      },
    ],
  },
  {
    group: 'Calendar Management',
    items: [
      {
        to: '/schedules',
        label: 'Schedules',
        iconKey: 'calendar',
        permission: 'view_any_calender_management_schedule_schedules',
      },
    ],
  },
];

const navItemByPath: ReadonlyMap<string, NavigationItemConfig> = new Map(
  navGroups.flatMap((group) => group.items).map((item) => [item.to, item]),
);

/**
 * Returns the sidebar title for a pathname based on `navGroups`.
 */
export const getNavTitle = (pathname: string): string =>
  navItemByPath.get(pathname)?.label ?? 'YourPay CMS';

