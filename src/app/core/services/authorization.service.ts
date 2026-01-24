import { Injectable, inject } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  keycloak = inject(Keycloak);

  private readonly checkUserRoles = (roles: string[]): boolean => {
    if (!roles || roles.length === 0) {
      return true;
    }

    roles.push('super_admin');

    const hasResourceRole = roles.some((role) =>
      this.keycloak.hasResourceRole(role)
    );
    const hasRealmRole = import.meta.env['NG_APP_KEYCLOAK_REALM']
      ? roles.some((role) => this.keycloak.hasRealmRole(role))
      : false;

    return hasResourceRole || hasRealmRole;
  };

  checkPermission = (requiredRoles: string[]): boolean =>
    this.checkUserRoles(requiredRoles);
}
