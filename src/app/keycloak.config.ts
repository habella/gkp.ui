import { HttpHandlerFn, HttpRequest } from '@angular/common/http'
import {
  AutoRefreshTokenService,
  CUSTOM_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  provideKeycloak,
  UserActivityService,
  withAutoRefreshToken,
} from 'keycloak-angular'

import Keycloak from 'keycloak-js'
import { getEnv } from './core/get-env'

export const provideKeycloakAngular = () =>
  provideKeycloak({
    config: {
      url: getEnv('NG_APP_KEYCLOAK_URL'),
      realm: getEnv('NG_APP_KEYCLOAK_REALM'),
      clientId: getEnv('NG_APP_KEYCLOAK_CLIENT_ID'),
    },
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: new URL(
        'silent-check-sso.html',
        document.baseURI,
      ).href,
      redirectUri: new URL('#/', document.baseURI).href,
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
