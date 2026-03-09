import {
  BarChart3,
  Calendar,
  CreditCard,
  FileCheck,
  FileText,
  Gift,
  Key,
  LayoutDashboard,
  Receipt,
  Settings,
  Users,
  Video,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";

export interface NavItemConfig {
  to: string;
  label: string;
  icon?: ReactNode;
  permission?: string;
}

export interface NavGroupConfig {
  group?: string;
  items: NavItemConfig[];
}

export const navGroups: NavGroupConfig[] = [
  {
    items: [
      {
        to: "/",
        label: "Dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
    ],
  },
  {
    group: "User & Access Management",
    items: [
      {
        to: "/identity-access",
        label: "Identity Access (API)",
        icon: <Key className="h-5 w-5" />,
        permission: "view_any_identity_access_resource",
      },
      {
        to: "/otp-logs",
        label: "OTP Logs (API)",
        icon: <FileText className="h-5 w-5" />,
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
        icon: <Users className="h-5 w-5" />,
        permission: "view_any_customers_resource",
      },
      {
        to: "/kyc-submission",
        label: "KYC Submission",
        icon: <FileCheck className="h-5 w-5" />,
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
        icon: <Receipt className="h-5 w-5" />,
        permission: "view_any_transaction_api_transaction",
      },
      {
        to: "/wallet-transaction-controls",
        label: "Wallet Transaction Controls (API)",
        icon: <Wallet className="h-5 w-5" />,
        permission: "view_any_wallet_transaction_control_resource",
      },
      {
        to: "/transaction-controls",
        label: "Transaction Controls (API)",
        icon: <Settings className="h-5 w-5" />,
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
        icon: <Video className="h-5 w-5" />,
        permission: "view_any_video_tutorial_api_video_tutorial",
      },
      {
        to: "/video-categories",
        label: "Video Category (API)",
        icon: <Video className="h-5 w-5" />,
        permission: "view_any_video_category_api_video_category",
      },
      {
        to: "/static-pages",
        label: "Static Page",
        icon: <FileText className="h-5 w-5" />,
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
        icon: <Gift className="h-5 w-5" />,
        permission: "view_any_voucher_management_resource",
      },
      {
        to: "/disburse-voucher",
        label: "Disburse Voucher",
        icon: <CreditCard className="h-5 w-5" />,
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
        icon: <Gift className="h-5 w-5" />,
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
        icon: <BarChart3 className="h-5 w-5" />,
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
        icon: <LayoutDashboard className="h-5 w-5" />,
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
        icon: <BarChart3 className="h-5 w-5" />,
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
        icon: <Wallet className="h-5 w-5" />,
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
        icon: <Settings className="h-5 w-5" />,
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
        icon: <Calendar className="h-5 w-5" />,
        permission: "view_any_calender_management_schedule_schedules",
      },
    ],
  },
];

