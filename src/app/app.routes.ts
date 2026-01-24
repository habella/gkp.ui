import { Routes } from '@angular/router'
import { canActivateAuthRole } from './core/guards/auth.guard'

export const routes: Routes = [
  {
    path: '',
    canActivate: [canActivateAuthRole],
    canActivateChild: [canActivateAuthRole],
    loadComponent: () =>
      import('./layout/base-page/base-page.component').then(
        (m) => m.BasePageComponent,
      ),
    children: [
      {
        path: 'index',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.routes').then((m) => m.routes),
      },
      // Security module - Users
      {
        path: 'users',
        loadChildren: () =>
          import('./modules/security/users/users.routes').then((m) => m.routes),
      },
      // Security module - Roles
      {
        path: 'roles',
        loadChildren: () =>
          import('./modules/security/roles/roles.routes').then((m) => m.routes),
      },
      // Security module - Permissions
      {
        path: 'permissions',
        loadChildren: () =>
          import('./modules/security/permissions/permissions.routes').then(
            (m) => m.routes,
          ),
      },
      {
        path: '**',
        redirectTo: 'index',
        pathMatch: 'full',
      },
    ],
  },
]
