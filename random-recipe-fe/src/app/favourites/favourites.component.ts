import { Component } from '@angular/core';
import { RandomRecipeService } from '../services/random-recipe.service';
import { Observable } from 'rxjs';
import { Recipe } from '../models/Recipe';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css'],
})
export class FavouritesComponent {
  selectedCategory: string = '';
  selectedArea: string = '';
  selectedIngredient: string = '';
  selectedIngredients: string[] = [];

  constructor(private readonly randomRecipeService: RandomRecipeService) {}

  categories$: Observable<string[]> = this.randomRecipeService.getCategories();
  areas$: Observable<string[]> = this.randomRecipeService.getAreas();
  ingredients$: Observable<string[]> =
    this.randomRecipeService.getIngredients();

  favouriteRecipes$: Observable<Recipe[]> =
    this.randomRecipeService.getFavourites();

  filterFavourites(): void {
    this.randomRecipeService.filterFavourites(
      this.selectedCategory,
      this.selectedArea,
      this.selectedIngredients
    );
  }

  clearCategory(): void {
    this.selectedCategory = '';
    this.randomRecipeService.refreshFavourites();
  }

  clearArea(): void {
    this.selectedArea = '';
    this.randomRecipeService.refreshFavourites();
  }

  clearIngredients(): void {
    this.selectedIngredients = [];
    this.randomRecipeService.refreshFavourites();
  }

  addIngredient(): void {
    if (
      this.selectedIngredient &&
      !this.selectedIngredients.includes(this.selectedIngredient)
    ) {
      this.selectedIngredients.push(this.selectedIngredient);
    }

    this.selectedIngredient = '';
  }

  removeIngredient(index: number): void {
    this.selectedIngredients.splice(index, 1);
    this.randomRecipeService.refreshFavourites();
  }
}
