import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Recipe } from '../models/Recipe';
import { RandomRecipeService } from '../services/random-recipe.service';

@Component({
  selector: 'app-random',
  templateUrl: './random.component.html',
  styleUrls: ['./random.component.css'],
})
export class RandomComponent implements OnInit, OnDestroy {
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
