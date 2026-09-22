"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsapPlugins } from "@/lib/gsap/registerPlugins";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Drives Lenis smooth scrolling and syncs it with GSAP's ticker +
 * ScrollTrigger, so pinned sections track the eased scroll position
 * rather than the raw (jankier) native scroll. Mount this once near
 * the root of the app (e.g. in a client layout wrapper).
 *
 * When the user prefers reduced motion, Lenis is skipped entirely and
 * the browser's native scroll behavior is left untouched.
 */
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    registerGsapPlugins();

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Lenis (default config, no custom wrapper/content) scrolls the
    // native window itself, so ScrollTrigger can keep using its
    // default `window` scroller unmodified — this is the pattern
    // Lenis's own docs recommend. We previously registered
    // document.body as a custom scroller via ScrollTrigger.scrollerProxy,
    // which was unnecessary and actively harmful: for a non-window
    // scroller, GSAP fakes pinning by transforming the scroller element
    // itself. A transform on <body> makes it the containing block for
    // every `position: fixed` descendant (including the header), so as
    // soon as any pinned ScrollTrigger section ran, the fixed header
    // started tracking body's transform instead of the viewport —
    // that was the source of the clipped/shifted navbar.
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  return lenisRef;
}