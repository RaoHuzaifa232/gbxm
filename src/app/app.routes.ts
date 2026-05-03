import { Routes } from '@angular/router';
import { MainLayoutComponent } from '@gbxm/layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'operator-console/edit-my-profile',
        loadComponent: () => import('@gbxm/items/operator-console/operator-console.component').then(m => m.OperatorConsoleComponent)
      },
      // {
      //   path: '',
      //   redirectTo: 'operator-console',
      //   pathMatch: 'full'
      // }
    ]
  }
];
