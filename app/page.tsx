"use client";

import Link from "next/link";
import { useRandomMeal } from "@/hooks/queries/useRandomMeal";
import { RevealText } from "@/components/animation/RevealText";
import { RevealImage } from "@/components/animation/RevealImage";
import { GrainOverlay } from "@/components/animation/GrainOverlay";

export default function LandingPage() {
  const { data: meal, isLoading, isError } = useRandomMeal();

  return (
    <section className="relative flex min-h-svh w-full items-end overflow-hidden">
      {meal?.thumbnail && (
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

      {/* Scrim so headline text stays legible over any photo MealDB returns */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <GrainOverlay />

      <div className="relative z-20 w-full px-6 pb-20 md:px-10 md:pb-28">
        <p className="mb-3 font-mono text-xs text-foreground-muted">
          {isLoading && "Fetching tonight's dish…"}
          {isError && "Couldn't reach TheMealDB — showing the archive anyway."}
          {meal?.area && meal?.category && `${meal.area} · ${meal.category}`}
        </p>

        <h1 className="max-w-3xl font-display text-5xl leading-[1.05] text-foreground md:text-7xl">
          {meal ? (
            <RevealText as="span">{meal.name}</RevealText>
          ) : (
            <span className="opacity-0">Loading</span>
          )}
        </h1>

        <p className="mt-6 max-w-md text-foreground-muted">
          A cinematic archive of dishes from every corner of the world —
          browse by category, follow a recipe scene by scene, or search
          for something specific.
        </p>

        <Link
          href="/explore"
          className="mt-10 inline-flex items-center rounded-full bg-accent px-7 py-3 text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.03]"
        >
          Begin the journey
        </Link>
      </div>
    </section>
  );
}
