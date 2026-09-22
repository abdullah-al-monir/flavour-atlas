"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap/registerPlugins";
import { useMealsByCategory } from "@/hooks/queries/useMealsByCategory";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import type { MealCategory } from "@/types/mealdb";

interface ChapterSectionProps {
  category: MealCategory;
  chapterNumber: number;
  totalChapters: number;
  onActivate: () => void;
  reducedMotion: boolean;
}

// Chapters used to pin for exactly as long as it took to scroll past
// every recipe in the category — a category with 20+ dishes meant
// 20+ cards' worth of scrolling before the next chapter could ever
// appear. Both numbers below decouple chapter pacing from category
// size: only the first CARDS_PER_CHAPTER recipes are ever part of the
// scroll-jacked row (the rest are one click away via "View all"), and
// the pin is additionally capped to MAX_PIN_VH viewport-heights so
// even a full row of 8 wide cards can't make a chapter feel longer
// than the others.
const CARDS_PER_CHAPTER = 7;
const MAX_PIN_VH = 1.4;

export function ChapterSection({
  category,
  chapterNumber,
  onActivate,
  reducedMotion,
}: ChapterSectionProps) {
  const { data: meals } = useMealsByCategory(category.strCategory);
  const visibleMeals = meals?.slice(0, CARDS_PER_CHAPTER) ?? [];
  const remainingCount = (meals?.length ?? 0) - visibleMeals.length;
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Desktop/tablet: pin the section and translate the card row
    // horizontally as the user scrolls vertically past it. Mobile gets
    // a plain vertical stack (see the responsive classes on the JSX
    // below) — matchMedia keeps the scroll-jacking trigger from ever
    // being created on small screens, since it maps poorly to touch
    // scroll physics.
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const rawDistance = track.scrollWidth - section.clientWidth;
      const scrollDistance = Math.min(rawDistance, window.innerHeight * MAX_PIN_VH);
      if (scrollDistance <= 0) return;

      const tween = reducedMotion
        ? null
        : gsap.to(track, {
            x: -scrollDistance,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${scrollDistance}`,
              scrub: 1,
              pin: true,
              onToggle: (self) => {
                if (self.isActive) onActivate();
              },
            },
          });

      if (reducedMotion) {
        // Still register a (non-scrubbed) trigger purely to drive the
        // progress-rail chapter counter, without pinning or moving
        // anything.
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) onActivate();
          },
        });
      }

      return () => {
        tween?.scrollTrigger?.kill();
        tween?.kill();
      };
    });

    return () => mm.revert();
  }, [reducedMotion, onActivate, visibleMeals.length]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-svh flex-col justify-center overflow-hidden border-t border-surface-border px-6 py-16 md:h-svh md:min-h-0 md:overflow-hidden md:px-10"
    >
      <header className="mb-8 flex items-baseline gap-4 md:mb-12">
        <span className="font-mono text-xs text-foreground-muted">
          {String(chapterNumber).padStart(2, "0")}
        </span>
        <h2 className="font-display text-3xl text-foreground md:text-5xl">
          {category.strCategory}
        </h2>
      </header>

      {/* Desktop: single row, translated by GSAP. Mobile: wraps into a
          normal vertical grid, no JS transform ever applied. */}
      <div
        ref={trackRef}
        className="flex flex-col gap-6 md:flex-row md:flex-nowrap md:gap-8 md:will-change-transform"
      >
        {visibleMeals.map((meal) => (
          <div key={meal.idMeal} className="w-full flex-shrink-0 md:w-72">
            <RecipeCard id={meal.idMeal} name={meal.strMeal} thumbnail={meal.strMealThumb} />
          </div>
        ))}

        {remainingCount > 0 && (
          <Link
            href={`/explore/category/${encodeURIComponent(category.strCategory)}`}
            className="group flex w-full flex-shrink-0 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-surface-border p-6 text-center transition-colors hover:border-accent md:aspect-[4/3] md:w-72"
          >
            <span className="font-display text-lg text-foreground">
              +{remainingCount} more
            </span>
            <span className="flex items-center gap-1 text-xs text-foreground-muted transition-colors group-hover:text-accent">
              View all in {category.strCategory} <ArrowRight size={14} />
            </span>
          </Link>
        )}
      </div>

      {/* Decorative category thumbnail, dimmed into the background —
          purely atmospheric, hidden from assistive tech. */}
      <Image
        src={category.strCategoryThumb}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="pointer-events-none absolute inset-0 -z-10 object-cover opacity-[0.06]"
      />
    </section>
  );
}