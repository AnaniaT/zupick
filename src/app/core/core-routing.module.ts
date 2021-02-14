import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CorePage } from './core.page';

// Incoming route '/home'
const routes: Routes = [
  {
    path: '',
    component: CorePage,
    children: [
      {
        path: '',
        redirectTo: '/home/ongoing',
        pathMatch: 'full',
      },
      {
        path: 'ongoing',
        loadChildren: () => import('./ongoing/ongoing.module').then( m => m.OngoingPageModule)
      },
      {
        path: 'past',
        loadChildren: () => import('./past/past.module').then( m => m.PastPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CorePageRoutingModule {}
