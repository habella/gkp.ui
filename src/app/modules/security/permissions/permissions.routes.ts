import { Route } from '@angular/router'

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./permission-list/permission-list').then(
        (m) => m.PermissionListComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./permission-detail/permission-detail').then(
        (m) => m.PermissionDetailComponent,
      ),
  },
]
