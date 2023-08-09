import { Component } from '@angular/core';
import { RandomRecipeService } from '../services/random-recipe.service';

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

  categories$ = this.randomRecipeService.getCategories();
  areas$ = this.randomRecipeService.getAreas();
  ingredients$ = this.randomRecipeService.getIngredients();

  favouriteRecipes$ = this.randomRecipeService.getFavourites();

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
