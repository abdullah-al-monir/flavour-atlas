"use client";

import { useRef } from "react";
import { Heart } from "lucide-react";
import { gsap } from "@/lib/gsap/registerPlugins";
import { useFavorites, type FavoriteMeal } from "@/hooks/useFavorites";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function FavoriteButton({ meal }: { meal: FavoriteMeal }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const iconRef = useRef<SVGSVGElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const active = isFavorite(meal.id);

  const handleClick = () => {
    const wasActive = active;
    toggleFavorite(meal);

    if (prefersReducedMotion || !iconRef.current) return;

    // Only pop on the "add" transition, not on removal — the brief
    // frames this as a reward for saving, not a generic click bounce.
    // This is also the one place the brief permits elastic easing.
    if (!wasActive) {
      gsap.fromTo(
        iconRef.current,
        { scale: 0.8 },
        { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" },
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-border transition-colors hover:border-accent"
    >
      <Heart
        ref={iconRef}
        size={18}
        className={active ? "fill-accent text-accent" : "text-foreground"}
      />
    </button>
  );
}
