import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core'
import {
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
} from '@angular/router'

import { registerLocaleData } from '@angular/common'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import localeEs from '@angular/common/locales/es'
import { provideGenericUi, providerStorage } from '@rauroszm/hermes-ui-kit'
import { AngularSvgIconModule } from 'angular-svg-icon'
import { customBearerTokenInterceptor } from 'keycloak-angular'
import { routes } from './app.routes'
import { httpCoreInterceptor } from './core/interceptors/http-core.interceptor'
import { httpErrorInterceptor } from './core/interceptors/http-error-interceptor'
import { requestInterceptor } from './core/interceptors/request-interceptor.interceptor'
import { provideKeycloakAngular } from './keycloak.config'

registerLocaleData(localeEs)

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    importProvidersFrom(AngularSvgIconModule.forRoot()),
    provideHttpClient(
      withInterceptors([
        customBearerTokenInterceptor,
        requestInterceptor,
        httpErrorInterceptor,
        httpCoreInterceptor,
      ]),
    ),
    provideKeycloakAngular(),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideGenericUi(),
    provideRouter(routes, withComponentInputBinding(), withHashLocation()),
    providerStorage(localStorage),
  ],
}
