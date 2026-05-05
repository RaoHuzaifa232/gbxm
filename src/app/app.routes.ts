import { Routes } from '@angular/router';
import { MainLayoutComponent } from '@gbxm/layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('@gbxm/pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'coming-soon',
        loadComponent: () => import('@gbxm/pages/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent)
      },
      {
        path: 'operator-console/edit-my-profile',
        loadComponent: () => import('@gbxm/items/operator-console/operator-console.component').then(m => m.OperatorConsoleComponent)
      },
      {
        path: 'campaigns',
        loadComponent: () => import('@gbxm/items/campaigns/campaigns.component').then(m => m.CampaignsComponent),
        children: [
          {
            path: 'all-campaigns',
            loadComponent: () => import('@gbxm/layout/sidebar/items/campaigns/all-campaigns/all-campaigns.component').then(m => m.AllCampaignsComponent)
          },
          {
            path: 'define-campaign',
            loadComponent: () => import('@gbxm/layout/sidebar/items/campaigns/define-campaign/define-campaign.component').then(m => m.DefineCampaignComponent)
          }
        ]
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: '**',
        loadComponent: () => import('@gbxm/pages/not-found/not-found.component').then(m => m.NotFoundComponent)
      }
    ]
  }
];
