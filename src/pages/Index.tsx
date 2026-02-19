import { useEffect, useState } from "react";
import { Database, CalendarDays, Eye, TrendingUp, AlertCircle } from "lucide-react";
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

    // Set up realtime subscription for extractions
    const channel = supabase
      .channel("extractions-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "extractions" },
        () => {
          // Refetch all data when extractions change
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
      <div className="px-8 py-8">
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 py-20">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">Error Loading Data</h3>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              fetchData();
            }}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Overview of your extraction pipeline.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </>
        ) : (
          <>
            <StatsCard title="Total Extractions" value={stats?.total ?? 0} icon={<Database className="h-4 w-4" />} />
            <StatsCard title="Today" value={stats?.today ?? 0} icon={<CalendarDays className="h-4 w-4" />} />
            <StatsCard title="Pending Review" value={stats?.pending ?? 0} icon={<Eye className="h-4 w-4" />} />
            <StatsCard title="Avg Confidence" value={stats?.avgConfidence ?? 0} suffix="%" icon={<TrendingUp className="h-4 w-4" />} />
          </>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
        </div>
      ) : (
        <DataTable data={extractions} />
      )}
    </div>
  );
};

export default Index;
