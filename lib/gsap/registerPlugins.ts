"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

let registered = false;

/**
 * Registers GSAP plugins exactly once, client-side only. Safe to call
 * from multiple components — subsequent calls are no-ops. Must run
 * before any ScrollTrigger/Flip usage, so call it from the top-level
 * GSAPProvider in the app tree.
 */
export function registerGsapPlugins() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, Flip);
  registered = true;
}

export { gsap, ScrollTrigger, Flip };
