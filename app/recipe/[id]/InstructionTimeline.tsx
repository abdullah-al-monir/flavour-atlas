"use client";

import { ScrollTrigger, registerGsapPlugins } from "@/lib/gsap/registerPlugins";
import { useEffect, useRef, useState } from "react";

interface InstructionTimelineProps {
  steps: string[];
}

/**
 * Deliberately uses onEnter/onLeave rather than `scrub` — the brief
 * calls out that pure scroll-scrubbing reads instructions at scroll
 * speed, which fights natural reading pace. Each step gets a discrete
 * "active" state instead, toggled as it crosses the viewport.
 */
export function InstructionTimeline({ steps }: InstructionTimelineProps) {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    registerGsapPlugins();

    const triggers = stepRefs.current.map((el, index) => {
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => setActiveStep(index),
        onEnterBack: () => setActiveStep(index),
      });
    });

    return () => triggers.forEach((t) => t?.kill());
  }, [steps]);

  return (
    <div className="flex gap-6">
      <div className="hidden w-10 flex-col items-center gap-1 font-mono text-xs text-foreground-muted md:flex">
        <div className="sticky top-24 flex flex-col gap-4">
          {steps.map((_, index) => (
            <span
              key={index}
              className={
                index === activeStep
                  ? "text-accent transition-colors"
                  : "transition-colors"
              }
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          ))}
        </div>
      </div>

      <ol className="flex-1 space-y-10">
        {steps.map((step, index) => (
          <li
            key={index}
            ref={(el) => {
              stepRefs.current[index] = el;
            }}
            className={
              index === activeStep
                ? "text-foreground transition-[color,opacity] duration-300"
                : "text-foreground-muted opacity-70 transition-[color,opacity] duration-300"
            }
          >
            <span className="mb-1 block font-mono text-xs text-accent md:hidden">
              STEP {String(index + 1).padStart(2, "0")}
            </span>
            <p className="max-w-[65ch] leading-relaxed">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
