import { Route } from '@angular/router'

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./role-list/role-list').then((m) => m.RoleListComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./role-detail/role-detail').then((m) => m.RoleDetailComponent),
  },
]
