import type { NavGroupConfig } from "./nav-types";
import { navIcons } from "./nav-icons";

export const navGroups: NavGroupConfig[] = [
  {
    items: [
      {
        to: "/",
        label: "Dashboard",
        icon: navIcons.dashboard,
      },
    ],
  },
  {
    group: "User & Access Management",
    items: [
      {
        to: "/identity-access",
        label: "Identity Access (API)",
        icon: navIcons.identityAccess,
        permission: "view_any_identity_access_resource",
      },
      {
        to: "/otp-logs",
        label: "OTP Logs (API)",
        icon: navIcons.otpLogs,
        permission: "view_any_otp_logs_api_resource",
      },
    ],
  },
  {
    group: "KYC & Verification",
    items: [
      {
        to: "/customers",
        label: "User Yourpay",
        icon: navIcons.users,
        permission: "view_any_customers_resource",
      },
      {
        to: "/kyc-submission",
        label: "KYC Submission",
        icon: navIcons.kycSubmission,
        permission: "view_any_kyc_submission_header_resource_api",
      },
    ],
  },
  {
    group: "Transaction Management",
    items: [
      {
        to: "/transactions",
        label: "Transactions (API)",
        icon: navIcons.transactions,
        permission: "view_any_transaction_api_transaction",
      },
      {
        to: "/wallet-transaction-controls",
        label: "Wallet Transaction Controls (API)",
        icon: navIcons.wallet,
        permission: "view_any_wallet_transaction_control_resource",
      },
      {
        to: "/transaction-controls",
        label: "Transaction Controls (API)",
        icon: navIcons.settings,
        permission: "view_any_transaction_control_api_transaction_control",
      },
    ],
  },
  {
    group: "Content Management",
    items: [
      {
        to: "/video-tutorials",
        label: "Video Tutorial (API)",
        icon: navIcons.video,
        permission: "view_any_video_tutorial_api_video_tutorial",
      },
      {
        to: "/video-categories",
        label: "Video Category (API)",
        icon: navIcons.video,
        permission: "view_any_video_category_api_video_category",
      },
      {
        to: "/static-pages",
        label: "Static Page",
        icon: navIcons.otpLogs,
        permission: "view_any_static_page_resource",
      },
    ],
  },
  {
    group: "Voucher Management",
    items: [
      {
        to: "/vouchers",
        label: "Voucher",
        icon: navIcons.gift,
        permission: "view_any_voucher_management_resource",
      },
      {
        to: "/disburse-voucher",
        label: "Disburse Voucher",
        icon: navIcons.creditCard,
        permission: "view_any_disbursement_voucher_resource",
      },
    ],
  },
  {
    group: "Marketing Configuration",
    items: [
      {
        to: "/scratch-cards",
        label: "Scratch Card",
        icon: navIcons.gift,
        permission: "view_any_scratch_card_resource",
      },
    ],
  },
  {
    group: "Reports & Analytics",
    items: [
      {
        to: "/report-dtva",
        label: "DTVA Transaction",
        icon: navIcons.chart,
        permission: "view_any_report_dtva_resource",
      },
    ],
  },
  {
    group: "Master Data",
    items: [
      {
        to: "/countries",
        label: "Countries (API)",
        icon: navIcons.dashboard,
        permission: "view_any_countries_api_resource",
      },
    ],
  },
  {
    group: "Exchange & Fee Management",
    items: [
      {
        to: "/exchange-rates",
        label: "Exchange Rates",
        icon: navIcons.chart,
        permission: "view_any_exchange_rates_resource",
      },
    ],
  },
  {
    group: "Customer Management",
    items: [
      {
        to: "/balance-adjustments",
        label: "Balance Adjustments",
        icon: navIcons.wallet,
        permission: "view_any_balance_adjustment_resource",
      },
    ],
  },
  {
    group: "Partner & Service Management",
    items: [
      {
        to: "/system-services",
        label: "System Service (API)",
        icon: navIcons.settings,
        permission: "view_any_system_service_api_resource",
      },
    ],
  },
  {
    group: "Calendar Management",
    items: [
      {
        to: "/schedules",
        label: "Schedules",
        icon: navIcons.calendar,
        permission: "view_any_calender_management_schedule_schedules",
      },
    ],
  },
];

