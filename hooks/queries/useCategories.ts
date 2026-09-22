import { useQuery } from "@tanstack/react-query";
import { mealDbClient } from "@/lib/api/client";
import type { CategoriesResponse, MealCategory } from "@/types/mealdb";

async function fetchCategories(): Promise<MealCategory[]> {
  const { data } = await mealDbClient.get<CategoriesResponse>("categories.php");
  return data.categories ?? [];
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    // Category list is effectively static.
    staleTime: 60 * 60_000,
  });
}
