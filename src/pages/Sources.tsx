import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, Inbox, RefreshCw, Mail, Send } from "lucide-react";
import SourceCard from "@/components/SourceCard";
import SourceDrawer from "@/components/SourceDrawer";
import LastUpdated from "@/components/LastUpdated";
import { Skeleton } from "@/components/ui/skeleton";
import { useSources } from "@/hooks/useSources";
import type { Source, SourceType } from "@/lib/types";
import { cn } from "@/lib/utils";

const filterTabs: { key: SourceType | "all"; label: string; icon: typeof Mail }[] = [
  { key: "all", label: "All", icon: Inbox },
  { key: "email", label: "Email", icon: Mail },
  { key: "telegram", label: "Telegram", icon: Send },
];

const Sources = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState<Source | null>(null);
  const typeFilter = (searchParams.get("type") as SourceType | null) || "all";

  const {
    data: sources = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
    lastUpdated,
    newRowIds,
  } = useSources();

  const filteredSources = useMemo(() => {
    if (typeFilter === "all") return sources;
    return sources.filter((s) => s.type === typeFilter);
  }, [sources, typeFilter]);

  const counts = useMemo(() => {
    return {
      all: sources.length,
      email: sources.filter((s) => s.type === "email").length,
      telegram: sources.filter((s) => s.type === "telegram").length,
    };
  }, [sources]);

  const handleFilterChange = (filter: SourceType | "all") => {
    if (filter === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ type: filter });
    }
  };

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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Sources
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Incoming emails and Telegram messages feeding your pipeline
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

      {/* Filter Tabs */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        {filterTabs.map((tab) => {
          const Icon = tab.icon;
          const count = counts[tab.key as keyof typeof counts];
          const isActive = typeFilter === tab.key || (typeFilter === "all" && tab.key === "all");

          return (
            <button
              key={tab.key}
              onClick={() => handleFilterChange(tab.key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "h-4 w-4",
                tab.key === "email" && !isActive && "text-blue-500",
                tab.key === "telegram" && !isActive && "text-sky-500"
              )} />
              {tab.label}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
      ) : filteredSources.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 sm:py-20 animate-fade-in">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            {typeFilter === "telegram" ? (
              <Send className="h-7 w-7 text-sky-400" />
            ) : typeFilter === "email" ? (
              <Mail className="h-7 w-7 text-blue-400" />
            ) : (
              <Inbox className="h-7 w-7 text-muted-foreground/50" />
            )}
          </div>
          <h3 className="mt-5 text-base font-semibold text-foreground">
            {typeFilter === "all"
              ? "No sources yet"
              : `No ${typeFilter} sources yet`}
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground text-center max-w-xs px-4">
            {typeFilter === "telegram"
              ? "Telegram messages will appear here..."
              : typeFilter === "email"
              ? "Email sources will appear here..."
              : "Pipeline is listening..."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredSources.map((source, index) => (
            <div
              key={source.id}
              className="animate-slide-up"
              style={{ animationDelay: `${Math.min(index, 10) * 30}ms` }}
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
