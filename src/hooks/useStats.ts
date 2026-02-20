import { useQuery } from "@tanstack/react-query";
import { getStats } from "@/lib/queries";

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });
}
