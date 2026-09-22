"use client";

import { useEffect, type ReactNode } from "react";
import { registerGsapPlugins } from "@/lib/gsap/registerPlugins";
import { useLenis } from "@/hooks/useLenis";

export function GSAPProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    registerGsapPlugins();
  }, []);

  // Mounted here so smooth scroll + ScrollTrigger sync is available
  // app-wide without every page re-wiring it.
  useLenis();

  return <>{children}</>;
}
