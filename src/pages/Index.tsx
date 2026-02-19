import { useEffect, useState } from "react";
import { Database, CalendarDays, Clock, TrendingUp, AlertCircle, RefreshCw } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import DataTable from "@/components/DataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { getExtractions, getStats } from "@/lib/queries";
import { supabase } from "@/lib/supabase";
import type { ExtractionWithSource, Stats } from "@/lib/types";

const Index = () => {
  const [extractions, setExtractions] = useState<ExtractionWithSource[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const [extractionsData, statsData] = await Promise.all([
        getExtractions(),
        getStats(),
      ]);
      setExtractions(extractionsData);
      setStats(statsData);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("extractions-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "extractions" },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-gradient-to-br from-destructive/5 to-destructive/10 py-16 sm:py-20 animate-fade-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-foreground">Error Loading Data</h3>
          <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm px-4">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              fetchData();
            }}
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Overview of your extraction pipeline performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
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
            <div className="animate-slide-up" style={{ animationDelay: "50ms" }}>
              <StatsCard
                title="Today"
                value={stats?.today ?? 0}
                icon={<CalendarDays className="h-5 w-5" />}
                accentColor="blue"
              />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
              <StatsCard
                title="Pending Review"
                value={stats?.pending ?? 0}
                icon={<Clock className="h-5 w-5" />}
                accentColor="amber"
              />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "150ms" }}>
              <StatsCard
                title="Avg Confidence"
                value={stats?.avgConfidence ?? 0}
                suffix="%"
                icon={<TrendingUp className="h-5 w-5" />}
                accentColor="purple"
              />
            </div>
          </>
        )}
      </div>

      {/* Table Section */}
      <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Extractions</h2>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-14 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
        ) : (
          <DataTable data={extractions} />
        )}
      </div>
    </div>
  );
};

export default Index;
