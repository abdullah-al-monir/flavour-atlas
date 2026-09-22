"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { gsap } from "@/lib/gsap/registerPlugins";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const MAGNETIC_SELECTOR = "a, button, [data-cursor-magnetic]";
const MAGNETIC_PULL = 0.35;

/**
 * A soft ember dot that trails the pointer and gets pulled toward
 * interactive elements it passes near. Per the brief this is a
 * dark-mode ("Night Kitchen") flourish — Editorial Daylight relies on
 * the native cursor and ordinary hover states instead, so the effect
 * is skipped entirely in light mode and for touch/coarse pointers and
 * reduced-motion users rather than just being visually muted.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const isDark = resolvedTheme === "dark";

  // `resolvedTheme` is undefined during SSR and on the very first
  // client render (next-themes only resolves it after mount), so
  // branching the returned JSX on `isDark` directly — without this
  // guard — rendered nothing on the server/first paint and a real
  // element right after, which React's hydration diff flagged as a
  // mismatch. Mirrors the same pattern already used in ThemeToggle.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !isDark || prefersReducedMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let magnetTarget: HTMLElement | null = null;

    gsap.set(dot, { xPercent: -50, yPercent: -50 });

    const quickX = gsap.quickTo(dot, "x", { duration: 0.5, ease: "power3.out" });
    const quickY = gsap.quickTo(dot, "y", { duration: 0.5, ease: "power3.out" });

    const handleMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;

      if (magnetTarget) {
        const rect = magnetTarget.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        pos.x += (cx - pos.x) * MAGNETIC_PULL;
        pos.y += (cy - pos.y) * MAGNETIC_PULL;
      }

      quickX(pos.x);
      quickY(pos.y);
    };

    const handleOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(MAGNETIC_SELECTOR);
      if (target) {
        magnetTarget = target;
        gsap.to(dot, { scale: 2.5, duration: 0.3, ease: "power2.out" });
      }
    };

    const handleOut = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(MAGNETIC_SELECTOR);
      if (target === magnetTarget) {
        magnetTarget = null;
        gsap.to(dot, { scale: 1, duration: 0.3, ease: "power2.out" });
      }
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerover", handleOver);
    window.addEventListener("pointerout", handleOut);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerover", handleOver);
      window.removeEventListener("pointerout", handleOut);
    };
  }, [mounted, isDark, prefersReducedMotion]);

  if (!mounted || !isDark || prefersReducedMotion) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[200] hidden h-3 w-3 rounded-full bg-accent mix-blend-screen md:block"
    />
  );
}