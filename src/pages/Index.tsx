import {
  Database,
  CalendarDays,
  TrendingUp,
  Truck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import DataTable from "@/components/DataTable";
import LastUpdated from "@/components/LastUpdated";
import { Skeleton } from "@/components/ui/skeleton";
import { useExtractions } from "@/hooks/useExtractions";
import { useStats } from "@/hooks/useStats";

const Index = () => {
  const {
    data: extractions = [],
    isLoading: extractionsLoading,
    isError: extractionsError,
    refetch: refetchExtractions,
    isRefetching: extractionsRefetching,
    lastUpdated,
    newRowIds,
  } = useExtractions();

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats,
  } = useStats();

  const isLoading = extractionsLoading || statsLoading;
  const isError = extractionsError || statsError;

  const handleRetry = () => {
    refetchExtractions();
    refetchStats();
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
            Failed to load dashboard data. Please try again.
          </p>
          <button
            onClick={handleRetry}
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
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Overview of your extraction pipeline performance
          </p>
        </div>
        {!isLoading && (
          <LastUpdated
            date={lastUpdated}
            isRefetching={extractionsRefetching}
            onRefresh={handleRetry}
          />
        )}
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </>
        ) : (
          <>
            <div className="animate-slide-up" style={{ animationDelay: "0ms" }}>
              <StatsCard
                title="Total Extractions"
                value={stats?.total ?? 0}
                icon={<Database className="h-5 w-5" />}
                accentColor="primary"
              />
            </div>
            <div
              className="animate-slide-up"
              style={{ animationDelay: "50ms" }}
            >
              <StatsCard
                title="Today's Extractions"
                value={stats?.today ?? 0}
                icon={<CalendarDays className="h-5 w-5" />}
                accentColor="blue"
              />
            </div>
            <div
              className="animate-slide-up"
              style={{ animationDelay: "100ms" }}
            >
              <StatsCard
                title="Avg Confidence"
                value={stats?.avgConfidence ?? 0}
                suffix="%"
                icon={<TrendingUp className="h-5 w-5" />}
                accentColor="purple"
              />
            </div>
            <div
              className="animate-slide-up"
              style={{ animationDelay: "150ms" }}
            >
              <StatsCard
                title="Top Delivery Type"
                value={stats?.topDeliveryType ?? "—"}
                icon={<Truck className="h-5 w-5" />}
                accentColor="amber"
              />
            </div>
          </>
        )}
      </div>

      {/* Table Section */}
      <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Recent Extractions
          </h2>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-14 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
        ) : (
          <DataTable data={extractions} newRowIds={newRowIds} />
        )}
      </div>
    </div>
  );
};

export default Index;
