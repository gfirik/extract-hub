import { SourceEmail } from "@/data/mockData";
import StatusBadge from "./StatusBadge";
import { X } from "lucide-react";

interface SourceDrawerProps {
  source: SourceEmail | null;
  onClose: () => void;
}

const SourceDrawer = ({ source, onClose }: SourceDrawerProps) => {
  if (!source) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col border-l border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">Source Details</h2>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">{source.sender}</p>
            <StatusBadge status={source.status} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Subject</p>
            <p className="text-sm text-foreground">{source.subject}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="text-sm text-foreground">{source.date}</p>
          </div>
          <div>
            <p className="mb-2 text-xs text-muted-foreground">Raw Body</p>
            <pre className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm text-foreground font-mono leading-relaxed">
              {source.body}
            </pre>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SourceDrawer;
