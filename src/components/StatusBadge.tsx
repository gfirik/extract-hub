import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: "pending" | "extracted" | "failed";
}

const statusConfig = {
  extracted: {
    label: "Extracted",
    icon: CheckCircle2,
    classes: "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200/50",
    dotColor: "bg-emerald-500",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    classes: "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200/50",
    dotColor: "bg-amber-500",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    classes: "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200/50",
    dotColor: "bg-red-500",
  },
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        config.classes
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
};

export default StatusBadge;
