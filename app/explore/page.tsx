"use client";

import { useEffect, useRef, useState } from "react";
import { useCategories } from "@/hooks/queries/useCategories";
import { ProgressRail } from "@/components/layout/ProgressRail";
import { ChapterSection } from "./ChapterSection";
import { gsap, ScrollTrigger, registerGsapPlugins } from "@/lib/gsap/registerPlugins";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function ExplorePage() {
  const { data: categories, isLoading } = useCategories();
  const [currentChapter, setCurrentChapter] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsapPlugins();
    return () => {
      // Belt-and-braces: kill any triggers this page created if the
      // user navigates away mid-animation.
      ScrollTrigger.getAll().forEach((t) => {
        if (containerRef.current?.contains(t.trigger as Node)) t.kill();
      });
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center font-mono text-sm text-foreground-muted">
        Loading categories…
      </div>
    );
  }
  console.log(categories)
  return (
    <div ref={containerRef} className="relative">
      {categories?.map((category, index) => (
        <ChapterSection
          key={category.idCategory}
          category={category}
          chapterNumber={index + 1}
          totalChapters={categories.length}
          onActivate={() => setCurrentChapter(index + 1)}
          reducedMotion={prefersReducedMotion}
        />
      ))}

      {categories && categories.length > 0 && (
        <ProgressRail current={currentChapter} total={categories.length} />
      )}
    </div>
  );
}

// Re-export so gsap tree-shakes cleanly if this page is ever code-split further.
export { gsap };
