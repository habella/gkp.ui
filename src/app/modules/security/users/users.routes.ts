import { Route } from '@angular/router'

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./user-list/user-list').then((m) => m.UserListComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./user-detail/user-detail').then((m) => m.UserDetailComponent),
  },
]
