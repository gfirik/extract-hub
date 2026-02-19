import { Database, CalendarDays, Eye, TrendingUp } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import DataTable from "@/components/DataTable";
import { extractions, stats } from "@/data/mockData";

const Index = () => {
  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Overview of your extraction pipeline.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Extractions" value={stats.totalExtractions} icon={<Database className="h-4 w-4" />} />
        <StatsCard title="Today" value={stats.today} icon={<CalendarDays className="h-4 w-4" />} />
        <StatsCard title="Pending Review" value={stats.pendingReview} icon={<Eye className="h-4 w-4" />} />
        <StatsCard title="Avg Confidence" value={stats.avgConfidence} suffix="%" icon={<TrendingUp className="h-4 w-4" />} />
      </div>

      <DataTable data={extractions} />
    </div>
  );
};

export default Index;
