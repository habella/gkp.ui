import { bootstrapApplication } from '@angular/platform-browser'
import config from 'devextreme/core/config'
import { App } from './app/app'
import { appConfig } from './app/app.config'
import { getEnv } from './app/core/get-env'

config({
  licenseKey: getEnv('NG_APP_DEVEXPRESS_LICENSE_KEY'),
})

bootstrapApplication(App, appConfig).catch((err) => console.error(err))
