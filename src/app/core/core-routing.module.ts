import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CorePage } from './core.page';

// Incoming route '/home'
const routes: Routes = [
  {
    path: '',
    component: CorePage,
    pathMatch: 'full',
  },
  {
    path: 'item/:id',
    loadChildren: () =>
      import('./item/item.module').then((m) => m.ItemPageModule),
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('./cart/cart.module').then((m) => m.CartPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CorePageRoutingModule {}
