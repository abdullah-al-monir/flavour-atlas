"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "flavor-atlas:favorites";

export interface FavoriteMeal {
  id: string;
  name: string;
  thumbnail: string | null;
}

/**
 * Client-persisted favorites list (localStorage) per the brief's v1
 * scope — swap this hook's internals for an API-backed one later
 * without touching any consuming component.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteMeal[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {
      // Corrupt or inaccessible storage — start from an empty list
      // rather than throwing.
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: FavoriteMeal[]) => {
    setFavorites(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage full or disabled (private browsing) — favorites still
      // work for the session, just won't survive a reload.
    }
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites],
  );

  const toggleFavorite = useCallback(
    (meal: FavoriteMeal) => {
      if (isFavorite(meal.id)) {
        persist(favorites.filter((f) => f.id !== meal.id));
      } else {
        persist([...favorites, meal]);
      }
    },
    [favorites, isFavorite, persist],
  );

  return { favorites, hydrated, isFavorite, toggleFavorite };
}
