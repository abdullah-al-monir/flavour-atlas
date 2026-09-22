# Flavor Atlas

A cinematic, scroll-driven recipe archive built on Next.js 16, Tailwind CSS 4, GSAP, and TheMealDB's free API. See the original project brief for full design rationale — this README covers what's in this scaffold and how to run it.

## LIve Link: [https://flavour-atlas-chi.vercel.app/](https://flavour-atlas-chi.vercel.app/)

## Getting started

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`. No environment variables or API keys are required — TheMealDB's free tier is used directly from the client.

## What's implemented

Every page and hook described in the brief has a working first pass wired end-to-end against the live API — this is a real, runnable app, not static markup:

- **Theming** — Tailwind 4 `@theme inline` tokens for both "Night Kitchen" (dark) and "Editorial Daylight" (light), swapped via a `.dark` class controlled by `next-themes`, with no flash-of-wrong-theme.
- **Landing (`/`)** — random dish from `random.php`, GSAP text/image reveal, parallax-ready hero.
- **Scroll Journey (`/explore`)** — categories pinned as chapters with horizontal card scroll on desktop (`gsap.matchMedia` gates this to `≥768px`), a plain vertical stack on mobile, and a live chapter counter.
- **Recipe detail (`/recipe/[id]`)** — parallax hero, staggered ingredient checklist, scroll-tracked instruction rail (`onEnter`/`onEnterBack`, not scrubbed), full-screen Cook Mode, favorite toggle with an elastic pop.
- **Search (`/search`)** — name/ingredient mode toggle, GSAP Flip-animated results grid, themed loading skeletons.
- **Favorites (`/favorites`)** — localStorage-persisted, same card/Flip system as Search.
- **Cross-cutting** — `useReducedMotion` gates every GSAP timeline; a magnetic custom cursor runs in dark mode only (skipped on touch and reduced-motion); grain/vignette overlays are opacity-zero (and therefore free) in light mode.

## What's intentionally left for you

A few things were stubbed rather than fully built out, either because they need visual/product judgment or because they're naturally a second pass:

- **shadcn `Command` palette** (⌘K search overlay from §4.4 of the brief) — `cmdk` is installed and `Dialog` is themed, but the palette itself isn't assembled. Current `/search` is a full page instead.
- **Page transitions** — no cross-route transition choreography yet; Next's App Router navigates instantly between pages.
- **SplitText-quality character animation** — `RevealText` does a custom word/char stagger split (no Club GreenSock dependency), which is close but not identical to true `SplitText` kerning-aware splitting.
- **Real content polish** — hero copy, empty states, and error copy are functional placeholders; give them a pass once you've seen the app running against live data (MealDB's photography and descriptions vary a lot in quality/tone across dishes, which will inform some of this).
- **Lighthouse / scroll-jank pass** — §9 of the brief calls for testing pinned sections on both trackpad and mouse-wheel and a performance pass; that needs a browser, not just source review.

## Architecture notes worth knowing before you extend this

- **`toMeal()`** in `types/mealdb.ts` is the one place that normalizes MealDB's flat `strIngredient1..20` shape — always extend data handling there, not in components.
- **`filter.php` responses are thin** (id/name/thumbnail only) while `lookup.php`/`search.php` return full records — `useSearchMeals` returns a union type for this reason; components branch on `"idMeal" in meal`.
- **Lenis + ScrollTrigger sync** lives in `hooks/useLenis.ts`, mounted once in `GSAPProvider` at the root — don't re-instantiate Lenis per-page.
- **`gsap.matchMedia()`** is what gates the Scroll Journey's horizontal pin to desktop; if you add more breakpoint-conditional animation, follow that pattern rather than checking `window.innerWidth` manually, so GSAP can clean up contexts correctly on resize.

## Folder structure

Matches the brief's proposed layout in full — see `app/`, `components/`, `hooks/`, `lib/`, `providers/`, `types/`.
