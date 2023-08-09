import { Component } from '@angular/core';
import { RandomRecipeService } from '../services/random-recipe.service';
import { Subscription, catchError } from 'rxjs';
import { Recipe } from '../models/Recipe';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  constructor(private readonly randomRecipeService: RandomRecipeService) {}

  mealName?: string;
  recipe: Recipe | null = null;
  sub?: Subscription;
  notFound = false;

  findRecipe(): void {
    if (!this.mealName) {
      return;
    }

    const sub = this.randomRecipeService
      .getRecipeByName(this.mealName)
      .pipe(
        catchError((error: unknown) => {
          if (error instanceof Error) {
            console.log('err', error);
          }

          this.recipe = null;
          this.notFound = true;
          return [];
        })
      )
      .subscribe((data: Recipe) => {
        this.recipe = data;
        this.notFound = false;
      });

    this.sub?.unsubscribe();
    this.sub = sub;
  }
}
