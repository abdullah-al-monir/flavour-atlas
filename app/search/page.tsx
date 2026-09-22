"use client";

import { useEffect, useRef, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import {
  useSearchMeals,
  type SearchMode,
} from "@/hooks/queries/useSearchMeals";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { RecipeCardSkeleton } from "@/components/ui/skeleton";
import { Flip } from "@/lib/gsap/registerPlugins";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const MODE_LABELS: Record<SearchMode, string> = {
  name: "By dish",
  ingredient: "By ingredient",
  category: "By category",
  area: "By country",
};

const PLACEHOLDERS: Record<SearchMode, string> = {
  name: "Search by dish name…",
  ingredient: "Search by ingredient…",
  category: "Search by category…",
  area: "Search by country…",
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>("name");
  const { data: results, isFetching } = useSearchMeals(query, mode);
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // GSAP Flip: capture card positions before the results list changes,
  // then animate from the old positions to the new ones once React has
  // re-rendered, instead of letting the grid jump-cut.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion || !grid.children.length) return;

    const state = Flip.getState(Array.from(grid.children));
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.5,
        ease: "power2.inOut",
        stagger: 0.03,
        absolute: true,
      });
    });
  }, [results, prefersReducedMotion]);

  return (
    <div className="mx-auto min-h-svh max-w-4xl px-6 pb-20 pt-32 md:px-10">
      <h1 className="mb-8 font-display text-3xl text-foreground md:text-4xl">
        Search the atlas
      </h1>

      <div className="mb-6 flex items-center gap-2 rounded-full border border-surface-border bg-surface px-5 py-3 backdrop-blur-sm dark:bg-surface/70">
        <SearchIcon size={16} className="text-foreground-muted" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={PLACEHOLDERS[mode]}
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground-muted"
        />
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        {(["name", "ingredient", "category", "area"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={
              m === mode
                ? "rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-accent-foreground"
                : "rounded-full border border-surface-border px-4 py-1.5 text-xs text-foreground-muted hover:text-foreground"
            }
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {isFetching && (
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isFetching && query.trim().length > 1 && results?.length === 0 && (
        <p className="text-sm text-foreground-muted">
          Nothing matched &ldquo;{query}&rdquo;. Try a different spelling or
          ingredient.
        </p>
      )}

      <div ref={gridRef} className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {results?.map((meal) => (
          <RecipeCard
            key={"idMeal" in meal ? meal.idMeal : meal.id}
            id={"idMeal" in meal ? meal.idMeal : meal.id}
            name={"strMeal" in meal ? meal.strMeal : meal.name}
            thumbnail={
              "strMealThumb" in meal ? meal.strMealThumb : meal.thumbnail
            }
          />
        ))}
      </div>
    </div>
  );
}
