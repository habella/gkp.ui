import { bootstrapApplication } from '@angular/platform-browser';
import config from 'devextreme/core/config';
import { App } from './app/app';
import { appConfig } from './app/app.config';

config({
  licenseKey: import.meta.env['NG_APP_DEVEXPRESS_LICENSE_KEY'],
});

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
