import { useQuery } from "@tanstack/react-query";
import { mealDbClient } from "@/lib/api/client";
import { toMeal, type Meal, type MealDBListResponse, type MealDBRaw } from "@/types/mealdb";

async function fetchRandomMeal(): Promise<Meal | null> {
  const { data } = await mealDbClient.get<MealDBListResponse<MealDBRaw>>("random.php");
  const raw = data.meals?.[0];
  return raw ? toMeal(raw) : null;
}

export function useRandomMeal() {
  return useQuery({
    queryKey: ["meal", "random"],
    queryFn: fetchRandomMeal,
    // A fresh dish every visit is the point of the hero, but keep a
    // short window so rapid remounts (e.g. theme toggle) don't refetch.
    staleTime: 30_000,
  });
}
