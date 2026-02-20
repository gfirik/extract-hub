import { useState } from "react";
import { AlertCircle, Inbox, RefreshCw } from "lucide-react";
import SourceCard from "@/components/SourceCard";
import SourceDrawer from "@/components/SourceDrawer";
import LastUpdated from "@/components/LastUpdated";
import { Skeleton } from "@/components/ui/skeleton";
import { useSources } from "@/hooks/useSources";
import type { Source } from "@/lib/types";

const Sources = () => {
  const [selected, setSelected] = useState<Source | null>(null);

  const {
    data: sources = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
    lastUpdated,
    newRowIds,
  } = useSources();

  if (isError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-gradient-to-br from-destructive/5 to-destructive/10 py-16 sm:py-20 animate-fade-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-foreground">
            Error Loading Data
          </h3>
          <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm px-4">
            Failed to load sources. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-95"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Sources
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Incoming emails and documents feeding your pipeline
          </p>
        </div>
        {!isLoading && (
          <LastUpdated
            date={lastUpdated}
            isRefetching={isRefetching}
            onRefresh={() => refetch()}
          />
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      ) : sources.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 sm:py-20 animate-fade-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Inbox className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-foreground">
            No sources yet
          </h3>
          <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm px-4">
            Pipeline is listening... Incoming emails and documents will appear
            here once they're received.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sources.map((source, index) => (
            <div
              key={source.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <SourceCard
                source={source}
                onClick={() => setSelected(source)}
                isNew={newRowIds.has(source.id)}
              />
            </div>
          ))}
        </div>
      )}

      <SourceDrawer source={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default Sources;
