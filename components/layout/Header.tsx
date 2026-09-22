import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/search", label: "Search" },
  { href: "/favorites", label: "Favorites" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-10">
      <Link href="/" className="font-display text-lg tracking-tight text-foreground">
        Flavor Atlas
      </Link>

      <nav className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-foreground-muted transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <ThemeToggle />
    </header>
  );
}
