import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./dasboard-index/dasboard-index').then((m) => m.DasboardIndex),
  },
];
