import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RandomComponent } from './random/random.component';
import { FavouritesComponent } from './favourites/favourites.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
