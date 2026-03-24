import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";

import { Button } from "@/shared/ui";
import type { User } from "@/entities/user";

/**
 * Builds {@link UserTable} column definitions.
 */
export function getUserTableColumns(): ColumnDef<User, unknown>[] {
  return [
    {
      id: "name",
      header: "Name",
      meta: { align: "left" },
      cell: ({ row }) => {
        const firstName = row.original.firstName ?? "";
        const lastName = row.original.lastName ?? "";
        const fullName = `${firstName} ${lastName}`.trim() || "-";
        return <span className="font-medium text-foreground">{fullName}</span>;
      },
    },
    {
      accessorKey: "id",
      header: "Customer ID",
      meta: { align: "center" },
    },
    {
      accessorKey: "userId",
      header: "User ID",
      meta: { align: "center" },
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
      meta: { align: "center" },
    },
    {
      accessorKey: "isPhoneActive",
      header: "Phone Number Status",
      meta: { align: "center" },
      cell: ({ getValue }) => {
        const value = getValue<boolean | undefined>();
        const label = value ? "Active" : "Inactive";
        const badgeClassName = value
          ? "bg-success/15 text-success border border-success/30"
          : "bg-muted text-muted-foreground";

        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badgeClassName}`}
          >
            {label}
          </span>
        );
      },
    },
    {
      accessorKey: "countryOfRegistration",
      header: "Country of registration",
      meta: { align: "center" },
      cell: ({ getValue }) => {
        const value = getValue<string | undefined>() ?? "";
        return value ? value.toUpperCase() : "-";
      },
    },
    {
      accessorKey: "nationality",
      header: "Nationality",
      meta: { align: "center" },
      cell: ({ getValue }) => {
        const value = getValue<string | undefined>() ?? "";
        return value ? String(value).toUpperCase() : "-";
      },
    },
    {
      accessorKey: "status",
      header: "User Status",
      meta: { align: "center" },
      cell: ({ getValue }) => {
        const raw = getValue<string | undefined>() ?? "";
        const value = raw.toLowerCase();
        let label = "Unknown";
        let badgeClassName = "bg-muted text-muted-foreground";

        if (value === "active") {
          label = "Active";
          badgeClassName = "bg-success/15 text-success border border-success/30";
        } else if (value === "blocked") {
          label = "Blocked";
          badgeClassName =
            "bg-destructive/15 text-destructive border border-destructive/30";
        } else if (value === "inactive") {
          label = "Inactive";
          badgeClassName = "bg-warning/15 text-warning border border-warning/30";
        }

        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badgeClassName}`}
          >
            {label}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      meta: { align: "center" },
    },
    {
      id: "actions",
      header: "Actions",
      size: 92,
      minSize: 92,
      meta: { align: "center" },
      cell: ({ row }) => {
        const customerId = row.original.id;

        if (!customerId) {
          return <span className="text-muted-foreground">-</span>;
        }

        return (
          <div className="flex justify-center">
            <Button asChild variant="default" size="sm" type="button">
              <Link to="/customers/$customerId" params={{ customerId }} className="h-7 px-2 text-xs">
                View
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];
}

