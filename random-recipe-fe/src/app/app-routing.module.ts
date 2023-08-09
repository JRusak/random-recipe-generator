import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RandomComponent } from './random/random.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { SearchComponent } from './search/search.component';
import { RandomWithPrefsComponent } from './random-with-prefs/random-with-prefs.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'random-recipe',
    pathMatch: 'full',
  },
  {
    path: 'random-recipe',
    component: RandomComponent,
  },
  {
    path: 'favourites',
    component: FavouritesComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'random-with-prefs',
    component: RandomWithPrefsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
