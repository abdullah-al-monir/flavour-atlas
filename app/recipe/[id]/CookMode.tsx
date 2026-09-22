"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "@/lib/gsap/registerPlugins";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface CookModeProps {
  steps: string[];
  onClose: () => void;
}

export function CookMode({ steps, onClose }: CookModeProps) {
  const [current, setCurrent] = useState(0);
  const textRef = useRef<HTMLParagraphElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, x: 0 });
      return;
    }

    gsap.fromTo(
      el,
      { opacity: 0, x: 24 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
    );
  }, [current, prefersReducedMotion]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCurrent((c) => Math.min(c + 1, steps.length - 1));
      if (e.key === "ArrowLeft") setCurrent((c) => Math.max(c - 1, 0));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, steps.length]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-background"
      role="dialog"
      aria-modal="true"
      aria-label="Cook Mode"
    >
      {/* Exit affordance always visible, per the brief */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Exit Cook Mode"
        className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-surface-border text-foreground hover:border-accent hover:text-accent"
      >
        <X size={18} />
      </button>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 text-center">
        <span className="mb-6 font-mono text-sm text-accent">
          STEP {String(current + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
        </span>
        <p ref={textRef} className="font-display text-2xl leading-snug text-foreground md:text-4xl">
          {steps[current]}
        </p>
      </div>

      <div className="mb-10 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => setCurrent((c) => Math.max(c - 1, 0))}
          disabled={current === 0}
          aria-label="Previous step"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-surface-border text-foreground disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => setCurrent((c) => Math.min(c + 1, steps.length - 1))}
          disabled={current === steps.length - 1}
          aria-label="Next step"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-surface-border text-foreground disabled:opacity-30"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
