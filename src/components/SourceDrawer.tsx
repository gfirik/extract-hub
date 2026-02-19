import type { Source } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import { X, Mail, FileText, Calendar, Clock, FileCode } from "lucide-react";
import { format } from "date-fns";

interface SourceDrawerProps {
  source: Source | null;
  onClose: () => void;
}

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  try {
    return format(new Date(dateStr), "MMM d, yyyy 'at' h:mm a");
  } catch {
    return "—";
  }
};

const SourceDrawer = ({ source, onClose }: SourceDrawerProps) => {
  if (!source) return null;

  const Icon = source.type === "email" ? Mail : FileText;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col bg-card shadow-2xl animate-slide-in-right sm:border-l sm:border-border">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-emerald-100">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Source Details</h2>
              <p className="text-xs text-muted-foreground capitalize">{source.type.replace("_", " ")}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Sender & Status */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">From</p>
              <p className="mt-1 text-sm font-semibold text-foreground truncate">{source.sender ?? "Unknown sender"}</p>
            </div>
            <StatusBadge status={source.status} />
          </div>

          {/* Subject */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Subject</p>
            <p className="mt-1 text-sm text-foreground">{source.subject ?? "No subject"}</p>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <p className="text-xs font-medium uppercase tracking-wider">Received</p>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">{formatDate(source.received_at)}</p>
            </div>
            {source.processed_at && (
              <div className="rounded-xl bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <p className="text-xs font-medium uppercase tracking-wider">Processed</p>
                </div>
                <p className="mt-2 text-sm font-medium text-foreground">{formatDate(source.processed_at)}</p>
              </div>
            )}
          </div>

          {/* Raw Body */}
          <div>
            <div className="mb-3 flex items-center gap-2 text-muted-foreground">
              <FileCode className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wider">Raw Content</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4 overflow-hidden">
              <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed overflow-x-auto">
                {source.raw_body ?? "No content available"}
              </pre>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SourceDrawer;
