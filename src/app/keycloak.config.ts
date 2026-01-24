import { HttpHandlerFn, HttpRequest } from '@angular/common/http'
import {
  AutoRefreshTokenService,
  CUSTOM_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  provideKeycloak,
  UserActivityService,
  withAutoRefreshToken,
} from 'keycloak-angular'

import Keycloak from 'keycloak-js'

export const provideKeycloakAngular = () =>
  provideKeycloak({
    config: {
      url: import.meta.env['NG_APP_KEYCLOAK_URL'],
      realm: import.meta.env['NG_APP_KEYCLOAK_REALM'],
      clientId: import.meta.env['NG_APP_KEYCLOAK_CLIENT_ID'],
    },
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri:
        window.location.origin + '/silent-check-sso.html',
      redirectUri: window.location.origin + '/#/',
      checkLoginIframe: false,
      responseMode: 'query',
    },
    features: [
      withAutoRefreshToken({
        onInactivityTimeout: 'logout',
        sessionTimeout: 18000000000, //30 minutes
      }),
    ],
    providers: [
      AutoRefreshTokenService,
      UserActivityService,
      {
        provide: CUSTOM_BEARER_TOKEN_INTERCEPTOR_CONFIG,
        useValue: [
          {
            shouldAddToken: async (
              req: HttpRequest<unknown>,
              next: HttpHandlerFn,
              keycloak: Keycloak,
            ) => {
              return keycloak.authenticated
            },
          },
        ],
      },
    ],
  })
