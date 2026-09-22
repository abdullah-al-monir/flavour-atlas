import { useQuery } from "@tanstack/react-query";
import { mealDbClient } from "@/lib/api/client";
import type { MealDBListResponse } from "@/types/mealdb";

/**
 * filter.php only returns a thin projection (id, name, thumbnail) —
 * not the full Meal shape — so it gets its own lightweight type
 * rather than being forced through `toMeal()`.
 */
export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

async function fetchMealsByCategory(category: string): Promise<MealSummary[]> {
  const { data } = await mealDbClient.get<MealDBListResponse<MealSummary>>("filter.php", {
    params: { c: category },
  });
  return data.meals ?? [];
}

export function useMealsByCategory(category: string | undefined) {
  return useQuery({
    queryKey: ["meals", "category", category],
    queryFn: () => fetchMealsByCategory(category as string),
    enabled: Boolean(category),
    staleTime: 5 * 60_000,
  });
}
