import { useQuery } from "@tanstack/react-query";
import { mealDbClient } from "@/lib/api/client";
import { toMeal, type Meal, type MealDBListResponse, type MealDBRaw } from "@/types/mealdb";

async function fetchMealById(id: string): Promise<Meal | null> {
  const { data } = await mealDbClient.get<MealDBListResponse<MealDBRaw>>("lookup.php", {
    params: { i: id },
  });
  const raw = data.meals?.[0];
  return raw ? toMeal(raw) : null;
}

export function useMealById(id: string | undefined) {
  return useQuery({
    queryKey: ["meal", id],
    queryFn: () => fetchMealById(id as string),
    enabled: Boolean(id),
    staleTime: 5 * 60_000,
  });
}
