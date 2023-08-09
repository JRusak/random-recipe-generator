import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../models/Recipe';
import { Subscription, catchError } from 'rxjs';
import { RandomRecipeService } from '../services/random-recipe.service';

@Component({
  selector: 'app-random-with-prefs',
  templateUrl: './random-with-prefs.component.html',
  styleUrls: ['./random-with-prefs.component.css'],
})
export class RandomWithPrefsComponent implements OnDestroy {
  selectedCategory: string = '';
  selectedArea: string = '';
  selectedIngredient: string = '';
  selectedIngredients: string[] = [];

  recipe?: Recipe;
  sub?: Subscription;
  notFound = false;

  constructor(private readonly randomRecipeService: RandomRecipeService) {}

  categories$ = this.randomRecipeService.getCategories();
  areas$ = this.randomRecipeService.getAreas();
  ingredients$ = this.randomRecipeService.getIngredients();

  clearCategory(): void {
    this.selectedCategory = '';
  }

  clearArea(): void {
    this.selectedArea = '';
  }

  clearIngredients(): void {
    this.selectedIngredients = [];
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
  }

  getRandomRecipeByPreference(): void {
    const sub = this.randomRecipeService
      .getRandomRecipeByPreference(
        this.selectedCategory,
        this.selectedArea,
        this.selectedIngredients
      )
      .pipe(
        catchError((error: unknown) => {
          if (error instanceof Error) {
            console.log('err', error);
          }

          this.recipe = undefined;
          this.notFound = true;
          return [];
        })
      )
      .subscribe((data: Recipe) => {
        console.log('data', data);
        if (!data) {
          this.recipe = undefined;
          this.notFound = true;
          return;
        }

        this.recipe = data;
        this.notFound = false;
      });

    this.sub?.unsubscribe();
    this.sub = sub;
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
