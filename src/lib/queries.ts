import { supabase } from "./supabase";
import type { Source, ExtractionWithSource, Stats } from "./types";

export async function getExtractions(): Promise<ExtractionWithSource[]> {
  try {
    const { data, error } = await supabase
      .from("extractions")
      .select(`
        *,
        sources (*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching extractions:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch extractions:", error);
    throw error;
  }
}

export async function getSources(): Promise<Source[]> {
  try {
    const { data, error } = await supabase
      .from("sources")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching sources:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch sources:", error);
    throw error;
  }
}

export async function getStats(): Promise<Stats> {
  try {
    // Get total count of extractions
    const { count: total, error: totalError } = await supabase
      .from("extractions")
      .select("*", { count: "exact", head: true });

    if (totalError) {
      console.error("Error fetching total count:", totalError);
      throw totalError;
    }

    // Get today's extractions count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const { count: todayCount, error: todayError } = await supabase
      .from("extractions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayISO);

    if (todayError) {
      console.error("Error fetching today count:", todayError);
      throw todayError;
    }

    // Get average confidence score and delivery types
    const { data: extractionsData, error: extractionsError } = await supabase
      .from("extractions")
      .select("confidence_score, delivery_type");

    if (extractionsError) {
      console.error("Error fetching extractions data:", extractionsError);
      throw extractionsError;
    }

    // Calculate average confidence
    const scores = extractionsData
      ?.map((e) => e.confidence_score)
      .filter((s): s is number => s !== null) || [];

    const avgConfidence = scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100)
      : 0;

    // Find most common delivery type
    const deliveryTypes = extractionsData
      ?.map((e) => e.delivery_type)
      .filter((d): d is string => d !== null) || [];

    const deliveryTypeCounts: Record<string, number> = {};
    deliveryTypes.forEach((type) => {
      deliveryTypeCounts[type] = (deliveryTypeCounts[type] || 0) + 1;
    });

    let topDeliveryType: string | null = null;
    let maxCount = 0;
    Object.entries(deliveryTypeCounts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topDeliveryType = type;
      }
    });

    return {
      total: total || 0,
      today: todayCount || 0,
      avgConfidence,
      topDeliveryType,
    };
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    throw error;
  }
}
