"use client";

import { useFavorites } from "@/hooks/useFavorites";
import { RecipeCard } from "@/components/recipe/RecipeCard";

export default function FavoritesPage() {
  const { favorites, hydrated } = useFavorites();

  return (
    <div className="mx-auto min-h-svh max-w-4xl px-6 pb-20 pt-32 md:px-10">
      <h1 className="mb-8 font-display text-3xl text-foreground md:text-4xl">Your favorites</h1>

      {hydrated && favorites.length === 0 && (
        <p className="text-sm text-foreground-muted">
          Nothing saved yet — open a recipe and tap the heart to add it here.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {favorites.map((meal) => (
          <RecipeCard key={meal.id} id={meal.id} name={meal.name} thumbnail={meal.thumbnail} />
        ))}
      </div>
    </div>
  );
}
