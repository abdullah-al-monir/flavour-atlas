"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * `attribute="class"` toggles the `.dark` class that globals.css keys
 * its Night Kitchen tokens off. `next-themes` injects a blocking
 * inline script before hydration so there's no flash-of-wrong-theme —
 * that script requires `suppressHydrationWarning` on <html> in
 * app/layout.tsx.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
