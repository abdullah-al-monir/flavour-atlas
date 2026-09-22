import Image from "next/image";
import Link from "next/link";

interface RecipeCardProps {
  id: string;
  name: string;
  thumbnail: string | null;
  /** Used by GSAP Flip on the Search/Favorites pages to key repositioning. */
  flipId?: string;
}

export function RecipeCard({ id, name, thumbnail, flipId }: RecipeCardProps) {
  return (
    <Link
      href={`/recipe/${id}`}
      data-flip-id={flipId ?? id}
      className="group block overflow-hidden rounded-lg border border-surface-border bg-surface transition-shadow hover:shadow-lg dark:hover:shadow-[0_0_24px_-8px_rgb(var(--shadow-color)/0.5)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={name}
            fill
            sizes="(min-width: 768px) 320px, 50vw"
            className="object-cover transition-transform duration-700 ease-[var(--ease-cinematic)] group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-background-alt text-xs text-foreground-muted">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-base leading-snug text-foreground">{name}</h3>
      </div>
    </Link>
  );
}
