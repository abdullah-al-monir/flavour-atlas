/**
 * TheMealDB returns every field as a flat, loosely-typed object with
 * up to 20 numbered ingredient/measure pairs. We type the raw shape
 * as it comes over the wire, then normalize it with `toMeal()` below
 * so the rest of the app never touches `strIngredient17`-style keys.
 */

export interface MealDBRaw {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate: string | null;
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  strMealThumb: string | null;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
  // strIngredient1..20 / strMeasure1..20
  [key: `strIngredient${number}`]: string | null | undefined;
  [key: `strMeasure${number}`]: string | null | undefined;
}

export interface MealDBListResponse<T> {
  meals: T[] | null;
}

export interface MealCategory {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface CategoriesResponse {
  categories: MealCategory[];
}

/** A single ingredient line, already paired with its measure. */
export interface Ingredient {
  id: string;
  name: string;
  measure: string;
}

/** The normalized shape used throughout the UI. */
export interface Meal {
  id: string;
  name: string;
  category: string | null;
  area: string | null;
  instructions: string[]; // split into steps for Cook Mode / scroll-scrubbed timeline
  thumbnail: string | null;
  tags: string[];
  youtube: string | null;
  source: string | null;
  ingredients: Ingredient[];
}

/** Converts a raw MealDB record into the normalized `Meal` shape. */
export function toMeal(raw: MealDBRaw): Meal {
  const ingredients: Ingredient[] = [];

  for (let i = 1; i <= 20; i++) {
    const name = raw[`strIngredient${i}`];
    const measure = raw[`strMeasure${i}`];
    if (name && name.trim()) {
      ingredients.push({
        id: `${raw.idMeal}-${i}`,
        name: name.trim(),
        measure: measure?.trim() || "",
      });
    }
  }

  const instructions = (raw.strInstructions || "")
    .split(/\r\n|\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    id: raw.idMeal,
    name: raw.strMeal,
    category: raw.strCategory,
    area: raw.strArea,
    instructions,
    thumbnail: raw.strMealThumb,
    tags: raw.strTags ? raw.strTags.split(",").map((t) => t.trim()) : [],
    youtube: raw.strYoutube,
    source: raw.strSource,
    ingredients,
  };
}
