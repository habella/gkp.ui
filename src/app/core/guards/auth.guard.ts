import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  const { authenticated, grantedRoles } = authData;

  // const requiredRole = route.data['role'];
  // if (!requiredRole) {
  //   return false;
  // }

  // const hasRequiredRole = (role: string): boolean =>
  //   Object.values(grantedRoles.resourceRoles).some((roles) =>
  //     roles.includes(role)
  //   );

  if (authenticated) {
    return true;
  }

  authData.keycloak.login();

  return false;
};

export const canActivateAuthRole =
  createAuthGuard<CanActivateFn>(isAccessAllowed);
