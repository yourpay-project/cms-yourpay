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

export const navIcons = {
  dashboard: <LayoutDashboard className="h-5 w-5" />,
  identityAccess: <Key className="h-5 w-5" />,
  otpLogs: <FileText className="h-5 w-5" />,
  users: <Users className="h-5 w-5" />,
  kycSubmission: <FileCheck className="h-5 w-5" />,
  transactions: <Receipt className="h-5 w-5" />,
  wallet: <Wallet className="h-5 w-5" />,
  settings: <Settings className="h-5 w-5" />,
  video: <Video className="h-5 w-5" />,
  gift: <Gift className="h-5 w-5" />,
  creditCard: <CreditCard className="h-5 w-5" />,
  chart: <BarChart3 className="h-5 w-5" />,
  calendar: <Calendar className="h-5 w-5" />,
} as const;

