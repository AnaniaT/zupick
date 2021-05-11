import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyordersPage } from './myorders.page';

const routes: Routes = [
  {
    path: '',
    component: MyordersPage,
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./order/order.module').then((m) => m.OrderPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyordersPageRoutingModule {}
