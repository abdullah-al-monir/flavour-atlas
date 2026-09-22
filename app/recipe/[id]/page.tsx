"use client";

import { use, useState } from "react";
import { useMealById } from "@/hooks/queries/useMealById";
import { RevealImage } from "@/components/animation/RevealImage";
import { StaggerList } from "@/components/animation/StaggerList";
import { InstructionTimeline } from "./InstructionTimeline";
import { CookMode } from "./CookMode";
import { FavoriteButton } from "@/components/recipe/FavoriteButton";
import { Checkbox } from "@/components/ui/checkbox";

export default function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: meal, isLoading, isError } = useMealById(id);
  const [cookModeOpen, setCookModeOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center font-mono text-sm text-foreground-muted">
        Loading recipe…
      </div>
    );
  }

  if (isError || !meal) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="font-display text-2xl text-foreground">Couldn&apos;t find that recipe.</p>
        <p className="text-sm text-foreground-muted">
          TheMealDB may be rate-limited, or this dish doesn&apos;t exist. Try again in a moment.
        </p>
      </div>
    );
  }

  return (
    <article className="relative">
      <section className="relative h-[70svh] w-full overflow-hidden">
        {meal.thumbnail && (
          <RevealImage
            src={meal.thumbnail}
            alt={meal.name}
            fill
            priority
            sizes="100vw"
            wrapperClassName="absolute inset-0"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute inset-x-6 bottom-10 flex items-end justify-between gap-4 md:inset-x-10">
          <div>
            {meal.category && meal.area && (
              <p className="mb-2 font-mono text-xs text-foreground-muted">
                {meal.area} · {meal.category}
              </p>
            )}
            <h1 className="font-display text-4xl text-foreground md:text-6xl">{meal.name}</h1>
          </div>
          <FavoriteButton meal={{ id: meal.id, name: meal.name, thumbnail: meal.thumbnail }} />
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-12 px-6 py-16 md:grid-cols-[1fr_2fr] md:px-10">
        <aside>
          <h2 className="mb-4 font-display text-xl text-foreground">Ingredients</h2>
          <StaggerList className="flex flex-col gap-3" onScroll>
            {meal.ingredients.map((ingredient) => (
              <label
                key={ingredient.id}
                className="flex items-start gap-3 text-sm text-foreground-muted"
              >
                <Checkbox className="mt-0.5" />
                <span>
                  <span className="text-foreground">{ingredient.name}</span>
                  {ingredient.measure && ` — ${ingredient.measure}`}
                </span>
              </label>
            ))}
          </StaggerList>
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl text-foreground">Instructions</h2>
            <button
              type="button"
              onClick={() => setCookModeOpen(true)}
              className="rounded-full border border-surface-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              Enter Cook Mode
            </button>
          </div>

          <InstructionTimeline steps={meal.instructions} />
        </div>
      </div>

      {cookModeOpen && (
        <CookMode steps={meal.instructions} onClose={() => setCookModeOpen(false)} />
      )}
    </article>
  );
}
