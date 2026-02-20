import type { Source } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import { Mail, FileText, ChevronRight, Video } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SourceCardProps {
  source: Source;
  onClick: () => void;
  isNew?: boolean;
}

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  try {
    return format(new Date(dateStr), "MMM d, yyyy 'at' h:mm a");
  } catch {
    return "—";
  }
};

const typeConfig = {
  email: {
    icon: Mail,
    label: "Email",
    classes: "bg-blue-50 text-blue-700 border-blue-200/50",
  },
  meet_summary: {
    icon: Video,
    label: "Meeting",
    classes: "bg-purple-50 text-purple-700 border-purple-200/50",
  },
};

const SourceCard = ({ source, onClick, isNew = false }: SourceCardProps) => {
  const config = typeConfig[source.type] || {
    icon: FileText,
    label: source.type,
    classes: "bg-gray-50 text-gray-700 border-gray-200/50",
  };
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:border-primary/30",
        isNew && "ring-2 ring-primary/50 bg-primary/5 animate-pulse"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-emerald-100 transition-colors group-hover:from-primary/20 group-hover:to-emerald-200">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {source.sender ?? "Unknown sender"}
            </p>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {source.subject ?? "No subject"}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground/50 transition-all group-hover:text-primary group-hover:translate-x-0.5" />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {formatDate(source.received_at)}
        </p>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
              config.classes
            )}
          >
            <Icon className="h-3 w-3" />
            {config.label}
          </span>
          <StatusBadge status={source.status} />
        </div>
      </div>
    </button>
  );
};

export default SourceCard;
