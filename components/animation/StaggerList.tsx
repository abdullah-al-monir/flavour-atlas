"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap/registerPlugins";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface StaggerListProps {
  children: ReactNode;
  className?: string;
  /** CSS selector, relative to the container, for the items to stagger. */
  itemSelector?: string;
  stagger?: number;
  /** Trigger the reveal when scrolled into view instead of on mount. */
  onScroll?: boolean;
}

/**
 * Wraps a list (ingredient checklist, recipe card grid, etc.) and
 * reveals its direct children with a staggered translateY + opacity
 * entrance. Set `onScroll` for lists further down the page so they
 * animate in as they enter the viewport rather than all firing at
 * once on mount.
 */
export function StaggerList({
  children,
  className,
  itemSelector = ":scope > *",
  stagger = 0.05,
  onScroll = false,
}: StaggerListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const items = el.querySelectorAll<HTMLElement>(itemSelector);
    if (!items.length) return;

    if (prefersReducedMotion) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(items, { opacity: 0, y: 16 });

    const animation = {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger,
    };

    if (onScroll) {
      const tween = gsap.to(items, {
        ...animation,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }

    const tween = gsap.to(items, animation);
    return () => {
      tween.kill();
    };
  }, [prefersReducedMotion, itemSelector, stagger, onScroll]);

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === containerRef.current) trigger.kill();
      });
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
