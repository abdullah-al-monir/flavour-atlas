"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap } from "@/lib/gsap/registerPlugins";
import { useEffect, useRef, type ElementType } from "react";

interface RevealTextProps {
  children: string;
  as?: ElementType;
  className?: string;
  /** Delay in seconds before the reveal starts (for choreographing with RevealImage). */
  delay?: number;
  /** Splits by word instead of character — gentler, reads better at long lengths. */
  splitBy?: "char" | "word";
}

/**
 * Staggered translateY + opacity reveal, split by character or word.
 * This is the "custom text-splitting utility" fallback mentioned in
 * the brief for when Club GreenSock's SplitText isn't installed — it
 * covers the hero headline and section titles without a paid plugin.
 */
export function RevealText({
  children,
  as: Tag = "span",
  className,
  delay = 0,
  splitBy = "word",
}: RevealTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const pieces = splitBy === "word" ? children.split(" ") : children.split("");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const units = el.querySelectorAll<HTMLElement>("[data-reveal-unit]");

    if (prefersReducedMotion) {
      gsap.set(units, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(units, { opacity: 0, y: "0.6em" });
    const tween = gsap.to(units, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      delay,
      ease: "expo.out",
      stagger: splitBy === "word" ? 0.06 : 0.02,
    });

    return () => {
      tween.kill();
    };
  }, [prefersReducedMotion, delay, splitBy, children]);

  return (
    <Tag ref={containerRef} className={className} aria-label={children}>
      {pieces.map((piece, i) => (
        <span
          key={i}
          data-reveal-unit
          className="inline-block will-change-transform"
          aria-hidden="true"
        >
          {piece}
          {splitBy === "word" && i < pieces.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Tag>
  );
}
