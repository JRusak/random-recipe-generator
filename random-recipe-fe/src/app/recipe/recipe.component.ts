import { Component, Input } from '@angular/core';
import { Recipe } from '../models/Recipe';
import { RandomRecipeService } from '../services/random-recipe.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
})
export class RecipeComponent {
  @Input('recipe') recipe?: Recipe;

  constructor(private readonly randomRecipeService: RandomRecipeService) {}

  addToFavourites(): void {
    if (!this.recipe) {
      return;
    }

    this.randomRecipeService.addToFavourites(this.recipe);
  }

  removeFromFavourites(): void {
    if (!this.recipe) {
      return;
    }

    this.randomRecipeService.removeFromFavourites(this.recipe);
  }

  isFavourite(): boolean {
    if (!this.recipe) {
      return false;
    }

    return this.randomRecipeService.isRecipeInFavourites(this.recipe.id);
  }

  printRecipe(): void {
    if (!this.recipe) {
      return;
    }

    console.log(this.randomRecipeService.formatRecipe(this.recipe));
  }
}
