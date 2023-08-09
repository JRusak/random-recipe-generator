import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { RecipeComponent } from './recipe/recipe.component';
import { RandomComponent } from './random/random.component';
import { RandomWithPrefsComponent } from './random-with-prefs/random-with-prefs.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { MenuComponent } from './menu/menu.component';
import { SearchComponent } from './search/search.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    RecipeComponent,
    RandomComponent,
    RandomWithPrefsComponent,
    FavouritesComponent,
    MenuComponent,
    SearchComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
