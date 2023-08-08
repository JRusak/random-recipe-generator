import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment as env } from 'src/environments/environment.development';
import { Ingredient } from '../models/Ingredient';
import { Recipe } from '../models/Recipe';

@Injectable({
  providedIn: 'root',
})
export class RandomRecipeService {
  constructor(private readonly http: HttpClient) {}

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

  private parseImagePath(meal: any) {
    return meal.strMealThumb.split('/').pop();
  }

  private parseRecipe(meal: any) {
    return {
      id: meal.idMeal,
      name: meal.strMeal,
      category: meal.strCategory,
      area: meal.strArea,
      instructions: meal.strInstructions,
      ingredients: this.parseIngredients(meal),
      imagePath: this.parseImagePath(meal),
      videoPath: meal.strYoutube,
    };
  }

  getRandomRecipe(): Observable<Recipe> {
    return this.http.get(`${env.API_METHODS_URL}random.php`).pipe(
      map((data: any) => data.meals[0]),
      map((meal: any) => this.parseRecipe(meal))
    );
  }
}
