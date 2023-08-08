import { Component, OnDestroy, OnInit } from '@angular/core';
import { RandomRecipeService } from '../services/random-recipe.service';
import { Subscription } from 'rxjs';
import { Recipe } from '../models/Recipe';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
})
export class RecipeComponent implements OnInit, OnDestroy {
  constructor(private readonly randomRecipeService: RandomRecipeService) {}

  recipe?: Recipe;
  sub?: Subscription;

  ngOnInit() {
    this.getRandomRecipe();
  }

  getRandomRecipe(): void {
    const sub = this.randomRecipeService
      .getRandomRecipe()
      .subscribe((data: Recipe) => {
        this.recipe = data;
      });

    this.sub?.unsubscribe();
    this.sub = sub;
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
