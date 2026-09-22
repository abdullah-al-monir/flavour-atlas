"use client";

import { useEffect, useRef } from "react";
import Image, { type ImageProps } from "next/image";
import { gsap } from "@/lib/gsap/registerPlugins";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface RevealImageProps extends Omit<ImageProps, "onLoad"> {
  wrapperClassName?: string;
  delay?: number;
}

/**
 * Reveals an image via a clip-path wipe (left-to-right) rather than a
 * plain fade, per the brief's motion language. Runs once the
 * <img> has actually loaded so the wipe never races ahead of empty
 * pixels.
 */
export function RevealImage({ wrapperClassName, delay = 0, ...imageProps }: RevealImageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const runReveal = () => {
    const el = wrapperRef.current;
    if (!el) return;

    if (prefersReducedMotion) {
      gsap.set(el, { clipPath: "inset(0 0% 0 0)", opacity: 1 });
      return;
    }

    gsap.fromTo(
      el,
      { clipPath: "inset(0 100% 0 0)", opacity: 0.9 },
      {
        clipPath: "inset(0 0% 0 0)",
        opacity: 1,
        duration: 1.2,
        delay,
        ease: "power3.inOut",
      },
    );
  };

  useEffect(() => {
    if (prefersReducedMotion && wrapperRef.current) {
      gsap.set(wrapperRef.current, { clipPath: "inset(0 0% 0 0)", opacity: 1 });
    }
  }, [prefersReducedMotion]);

  return (
    <div ref={wrapperRef} className={wrapperClassName}>
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is required via imageProps */}
      <Image {...imageProps} onLoad={runReveal} />
    </div>
  );
}
