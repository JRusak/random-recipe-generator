import { Component } from '@angular/core';
import { RandomRecipeService } from '../services/random-recipe.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css'],
})
export class FavouritesComponent {
  constructor(private readonly randomRecipeService: RandomRecipeService) {}

  favouriteRecipes$ = this.randomRecipeService.getFavourites();
}
