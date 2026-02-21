import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  suffix?: string;
  accentColor?: "primary" | "blue" | "amber" | "purple" | "cyan";
}

const accentStyles = {
  primary: {
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
    iconShadow: "shadow-emerald-500/25",
  },
  blue: {
    iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
    iconShadow: "shadow-blue-500/25",
  },
  amber: {
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
    iconShadow: "shadow-amber-500/25",
  },
  purple: {
    iconBg: "bg-gradient-to-br from-purple-500 to-pink-600",
    iconShadow: "shadow-purple-500/25",
  },
  cyan: {
    iconBg: "bg-gradient-to-br from-sky-500 to-cyan-600",
    iconShadow: "shadow-sky-500/25",
  },
};

const StatsCard = ({ title, value, icon, suffix, accentColor = "primary" }: StatsCardProps) => {
  const styles = accentStyles[accentColor];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5">
      {/* Subtle gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-muted/50 opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
            {suffix && <span className="text-lg font-medium text-muted-foreground">{suffix}</span>}
          </div>
        </div>

        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.iconBg} shadow-lg ${styles.iconShadow} text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
