import axios, { AxiosError } from "axios";

export const MEALDB_BASE_URL = "https://www.themealdb.com/api/json/v1/1/";

export const mealDbClient = axios.create({
  baseURL: MEALDB_BASE_URL,
  timeout: 10_000,
});

export class MealDbError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "MealDbError";
    this.status = status;
  }
}

mealDbClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // MealDB is up but returned a non-2xx status.
      return Promise.reject(
        new MealDbError(
          `TheMealDB request failed (${error.response.status})`,
          error.response.status,
        ),
      );
    }

    if (error.request) {
      // Request was made but no response came back — network issue,
      // timeout, or MealDB rate-limiting silently dropping it.
      return Promise.reject(
        new MealDbError("No response from TheMealDB — check your connection or try again."),
      );
    }

    return Promise.reject(new MealDbError(error.message));
  },
);
