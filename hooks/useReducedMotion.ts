"use client";

import { useEffect, useState } from "react";

/**
 * Reactive `prefers-reduced-motion` flag. Every GSAP timeline in the
 * app should either skip itself or fall back to an instant/opacity-only
 * transition when this is true — see RevealText/RevealImage/StaggerList
 * for the pattern.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const handler = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  return reduced;
}
