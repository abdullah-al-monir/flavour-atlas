import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/search", label: "Search" },
  { href: "/favorites", label: "Favorites" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-6 py-5 md:px-10">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between rounded-full border border-surface-border/80 bg-background/70 px-4 py-2 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-md transition-colors md:px-6">
        <Link
          href="/"
          className="font-display text-lg tracking-tight text-foreground drop-shadow-[0_1px_0_rgba(255,255,255,0.35)]"
        >
          Flavor Atlas
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground drop-shadow-[0_1px_0_rgba(255,255,255,0.25)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
