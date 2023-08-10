import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  forkJoin,
  map,
  of,
  switchMap,
} from 'rxjs';
import { environment as env } from 'src/environments/environment.development';
import { Ingredient } from '../models/Ingredient';
import { Recipe } from '../models/Recipe';

@Injectable({
  providedIn: 'root',
})
export class RandomRecipeService {
  constructor(private readonly http: HttpClient) {}

  favourites: Recipe[] = [];

  private refreshFavourties$ = new BehaviorSubject<Recipe[]>([]);
  private favouriteRecipes$: Observable<Recipe[]> =
    this.refreshFavourties$.pipe(switchMap((_value) => of(_value)));

  private parseIngredients(meal: any): Ingredient[] {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        ingredients.push({
          name: meal[`strIngredient${i}`],
          measure: meal[`strMeasure${i}`],
        });
      }
    }

    return ingredients;
  }

  private parseRecipe(meal: any) {
    return {
      id: meal.idMeal,
      name: meal.strMeal,
      category: meal.strCategory,
      area: meal.strArea,
      instructions: meal.strInstructions,
      ingredients: this.parseIngredients(meal),
      imagePath: meal.strMealThumb,
      videoPath: meal.strYoutube,
    };
  }

  getRandomRecipe(): Observable<Recipe> {
    return this.http.get(`${env.API_URL}random.php`).pipe(
      map((data: any) => data.meals[0]),
      map((meal: any) => this.parseRecipe(meal))
    );
  }

  addToFavourites(recipe: Recipe): void {
    this.favourites.push(recipe);

    this.refreshFavourties$.next(this.favourites);
  }

  removeFromFavourites(recipe: Recipe): void {
    this.favourites = this.favourites.filter((r) => r.id !== recipe.id);

    this.refreshFavourties$.next(this.favourites);
  }

  refreshFavourites(): void {
    this.refreshFavourties$.next(this.favourites);
  }

  filterFavourites(
    category: string,
    area: string,
    ingredients: string[]
  ): void {
    let filteredFavourites = this.favourites;
    if (category) {
      filteredFavourites = filteredFavourites.filter(
        (recipe) => recipe.category === category
      );
    }

    if (area) {
      filteredFavourites = filteredFavourites.filter(
        (recipe) => recipe.area === area
      );
    }

    if (ingredients.length > 0) {
      filteredFavourites = this.filterByIngredients(
        filteredFavourites,
        ingredients
      );
    }

    this.refreshFavourties$.next(filteredFavourites);
  }

  getFavourites(): Observable<Recipe[]> {
    return this.favouriteRecipes$;
  }

  getRecipeByName(name: string): Observable<Recipe> {
    return this.http.get(`${env.API_URL}search.php?s=${name}`).pipe(
      map((data: any) => {
        if (!data.meals) {
          throw new Error('No recipe found');
        }
        return data.meals[0];
      }),
      map((meal: any) => this.parseRecipe(meal))
    );
  }

  private getRecipeById(id: string): Observable<Recipe> {
    return this.http.get(`${env.API_URL}lookup.php?i=${id}`).pipe(
      map((data: any) => data.meals[0]),
      map((meal: any) => this.parseRecipe(meal))
    );
  }

  isRecipeInFavourites(id: string): boolean {
    return this.favourites.some((r) => r.id === id);
  }

  private formatIngredients(ingredients: Ingredient[]): string {
    return ingredients
      .map(
        (ingredient, index) =>
          `${index + 1}. ${ingredient.name} - ${ingredient.measure}`
      )
      .join('\n');
  }

  formatRecipe(recipe: Recipe): string {
    const formattedIngredients = this.formatIngredients(recipe.ingredients);

    return `
Name: ${recipe.name}

Category: ${recipe.category}
Cusine: ${recipe.area}

Instructions:
${recipe.instructions}

Ingredients:
${formattedIngredients}
    `;
  }

  getCategories(): Observable<string[]> {
    return this.http.get(`${env.API_URL}list.php?c=list`).pipe(
      map((data: any) => data.meals.map((meal: any) => meal.strCategory)),
      map((categories: string[]) => categories.sort())
    );
  }

  getAreas(): Observable<string[]> {
    return this.http.get(`${env.API_URL}list.php?a=list`).pipe(
      map((data: any) => data.meals.map((meal: any) => meal.strArea)),
      map((areas: string[]) => areas.sort())
    );
  }

  getIngredients(): Observable<string[]> {
    return this.http.get(`${env.API_URL}list.php?i=list`).pipe(
      map((data: any) => data.meals.map((meal: any) => meal.strIngredient)),
      map((ingredients: string[]) => ingredients.sort())
    );
  }

  private filterByIngredients(
    meals: Recipe[],
    ingredients: string[]
  ): Recipe[] {
    return meals.filter((meal) =>
      ingredients.every((ingredient) => {
        if (!meal.ingredients) {
          return false;
        }

        return meal.ingredients.some(
          (mealIngredient) => mealIngredient.name === ingredient
        );
      })
    );
  }

  private getFilteredByCategory(category: string): Observable<Recipe[]> {
    return this.http.get(`${env.API_URL}filter.php?c=${category}`).pipe(
      map((data: any) =>
        data.meals.map((meal: any) => this.getRecipeById(meal.idMeal))
      ),
      switchMap((recipes: Observable<Recipe>[]) => forkJoin(recipes))
    );
  }

  private getFilteredByArea(area: string): Observable<Recipe[]> {
    return this.http.get(`${env.API_URL}filter.php?a=${area}`).pipe(
      map((data: any) =>
        data.meals.map((meal: any) => this.getRecipeById(meal.idMeal))
      ),
      switchMap((recipes: Observable<Recipe>[]) => forkJoin(recipes))
    );
  }

  private getFilteredRecipes(
    category: string,
    area: string,
    ingredients: string[]
  ): Observable<Recipe[]> {
    if (category) {
      return this.getFilteredByCategory(category).pipe(
        map((meals: Recipe[]) => {
          if (area) {
            return meals.filter((meal) => meal.area === area);
          }

          return meals;
        }),
        map((meals: Recipe[]) => {
          if (ingredients.length > 0) {
            return this.filterByIngredients(meals, ingredients);
          }

          return meals;
        })
      );
    } else if (area) {
      return this.getFilteredByArea(area).pipe(
        map((meals: Recipe[]) => {
          if (ingredients.length > 0) {
            return this.filterByIngredients(meals, ingredients);
          }

          return meals;
        })
      );
    } else {
      return this.http.get(`${env.API_URL}search.php?s=`).pipe(
        map((data: any) =>
          data.meals.map((meal: any) => this.parseRecipe(meal))
        ),
        map((meals: Recipe[]) => {
          if (ingredients.length > 0) {
            return this.filterByIngredients(meals, ingredients);
          }

          return meals;
        })
      );
    }
  }

  getRandomRecipeByPreference(
    category: string,
    area: string,
    ingredients: string[]
  ): Observable<Recipe> {
    return this.getFilteredRecipes(category, area, ingredients).pipe(
      map(
        (filteredMeals: any[]) =>
          filteredMeals[Math.floor(Math.random() * filteredMeals.length)]
      )
    );
  }
}
