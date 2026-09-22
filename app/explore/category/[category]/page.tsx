"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useMealsByCategory } from "@/hooks/queries/useMealsByCategory";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { RecipeCardSkeleton } from "@/components/ui/skeleton";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: encodedCategory } = use(params);
  const category = decodeURIComponent(encodedCategory);
  const { data: meals, isLoading } = useMealsByCategory(category);

  return (
    <div className="mx-auto min-h-svh max-w-6xl px-6 pb-20 pt-32 md:px-10">
      <Link
        href="/explore"
        className="mb-6 inline-flex items-center gap-2 text-xs text-foreground-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft size={14} /> Back to the journey
      </Link>

      <h1 className="mb-10 font-display text-3xl text-foreground md:text-4xl">
        {category}
      </h1>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}

        {meals?.map((meal) => (
          <RecipeCard
            key={meal.idMeal}
            id={meal.idMeal}
            name={meal.strMeal}
            thumbnail={meal.strMealThumb}
          />
        ))}
      </div>

      {!isLoading && meals?.length === 0 && (
        <p className="text-sm text-foreground-muted">
          No recipes found in this category.
        </p>
      )}
    </div>
  );
}
