import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideZoneChangeDetection } from '@angular/core';

import { AppComponent } from './app/app.component';
import { routes } from './app/config/app.routes';
import { appConfig } from './app/config/app.config';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideZoneChangeDetection(),
    { provide: 'APP_CONFIG', useValue: appConfig } // Provide custom config
  ]
}).catch((err) => console.error(err));
