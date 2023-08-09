import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
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
    this.refreshFavourties$.pipe(switchMap((_value) => of(this.favourites)));

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
    return this.http.get(`${env.API_METHODS_URL}random.php`).pipe(
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

  getFavourites(): Observable<Recipe[]> {
    return this.favouriteRecipes$;
  }

  getRecipeByName(name: string): Observable<Recipe> {
    return this.http.get(`${env.API_METHODS_URL}search.php?s=${name}`).pipe(
      map((data: any) => data.meals[0]),
      map((meal: any) => this.parseRecipe(meal))
    );
  }

  private getRecipeById(id: string): Observable<Recipe> {
    return this.http.get(`${env.API_METHODS_URL}lookup.php?i=${id}`).pipe(
      map((data: any) => data.meals[0]),
      map((meal: any) => this.parseRecipe(meal))
    );
  }

  isRecipeInFavourites(id: string): boolean {
    return this.favourites.some((r) => r.id === id);
  }
}
