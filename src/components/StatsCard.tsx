import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  suffix?: string;
}

const StatsCard = ({ title, value, icon, suffix }: StatsCardProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <div className="mt-2">
        <span className="text-2xl font-bold text-card-foreground">{value}</span>
        {suffix && <span className="ml-1 text-sm text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
};

export default StatsCard;
