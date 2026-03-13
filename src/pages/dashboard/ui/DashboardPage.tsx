import type { FC } from "react";

type DashboardPageProps = Record<string, never>;

const DashboardPage: FC<DashboardPageProps> = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <p className="mt-1 text-muted-foreground">Welcome to YourPay CMS.</p>
    </div>
  );
};

export default DashboardPage;

