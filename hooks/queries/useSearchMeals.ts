import { mealDbClient } from "@/lib/api/client";
import { toMeal, type Meal, type MealDBListResponse, type MealDBRaw } from "@/types/mealdb";
import { useQuery } from "@tanstack/react-query";
import type { MealSummary } from "./useMealsByCategory";

export type SearchMode = "name" | "ingredient" | "category" | "area";
type SearchResult = Meal | MealSummary;

async function searchByName(query: string): Promise<Meal[]> {
  const { data } = await mealDbClient.get<MealDBListResponse<MealDBRaw>>("search.php", {
    params: { s: query },
  });
  return (data.meals ?? []).map(toMeal);
}

async function searchByIngredient(ingredient: string): Promise<MealSummary[]> {
  const { data } = await mealDbClient.get<MealDBListResponse<MealSummary>>("filter.php", {
    params: { i: ingredient },
  });
  return data.meals ?? [];
}

async function searchByCategory(category: string): Promise<MealSummary[]> {
  const { data } = await mealDbClient.get<MealDBListResponse<MealSummary>>("filter.php", {
    params: { c: category },
  });
  return data.meals ?? [];
}

async function searchByArea(area: string): Promise<MealSummary[]> {
  const { data } = await mealDbClient.get<MealDBListResponse<MealSummary>>("filter.php", {
    params: { a: area },
  });
  return data.meals ?? [];
}

/**
 * Returns a union result: full `Meal` objects in name mode (search.php
 * gives full records), thin `MealSummary` objects in the other modes
 * (filter.php only gives id/name/thumbnail). Consuming components
 * should treat both as "enough for a card" and use `useMealById` if
 * they need full detail for a filter-mode result.
 */
export function useSearchMeals(query: string, mode: SearchMode) {
  return useQuery<SearchResult[]>({
    queryKey: ["meals", "search", mode, query],
    queryFn: async (): Promise<SearchResult[]> => {
      switch (mode) {
        case "name":
          return searchByName(query);
        case "ingredient":
          return searchByIngredient(query);
        case "category":
          return searchByCategory(query);
        case "area":
          return searchByArea(query);
      }
    },
    enabled: query.trim().length > 1,
    staleTime: 60_000,
  });
}