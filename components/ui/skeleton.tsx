import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * Two genuinely different loading treatments rather than one gray box
 * re-tinted: dark mode gets a slow amber sweep across a near-black
 * card (like a print developing under safelight); light mode gets a
 * soft, even pulse, closer to a printed page's placeholder block.
 * Both are defined once in globals.css-adjacent utility classes below
 * so they can be reused anywhere a card is still loading.
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-surface",
        "animate-pulse dark:animate-none",
        className,
      )}
      {...props}
    >
      {/* Dark mode: developing-film shimmer sweep */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            "linear-gradient(100deg, transparent 30%, rgb(var(--shadow-color) / 0.18) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
          animation: "shimmer-sweep 1.8s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes shimmer-sweep {
          0% { background-position: 150% 0; }
          100% { background-position: -50% 0; }
        }
      `}</style>
    </div>
  );
}

export function RecipeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-surface-border">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
