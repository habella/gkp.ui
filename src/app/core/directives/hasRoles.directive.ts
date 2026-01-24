import {
  Directive,
  effect,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEventType,
  ReadyArgs,
  typeEventArgs,
} from 'keycloak-angular';
import Keycloak from 'keycloak-js';
import { AuthorizationService } from '../services/authorization.service';

@Directive({
  selector: '[hasRoles]',
  standalone: true,
})
export class HasRolesDirective {
  /**
   * List of roles to validate.
   */
  @Input('hasRoles') roles: string[] = [];

  authorization = inject(AuthorizationService);
  keycloak = inject(Keycloak);

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef
  ) {
    const keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

    effect(() => {
      const keycloakEvent = keycloakSignal();
      this.viewContainer.clear();
      if (
        keycloakEvent.type !== KeycloakEventType.Ready &&
        keycloakEvent.type !== KeycloakEventType.AuthRefreshSuccess
      ) {
        return;
      }

      const authenticated = typeEventArgs<ReadyArgs>(keycloakEvent.args);

      if (this.keycloak.authenticated) {
        this.render();
      }
    });
  }

  private render(): void {
    const hasAccess = this.authorization.checkPermission(this.roles);
    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
