import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideZoneChangeDetection } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { AppComponent } from './app/app.component';
import { routes } from './app/config/app.routes';
import { appConfig } from './app/config/app.config';
import { APP_CONFIG } from './app/config/app-config.token';
import { withInterceptorsFromDi } from '@angular/common/http';
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection(),
    { provide: APP_CONFIG, useValue: appConfig },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }// Provide custom config
  ]
}).catch((err) => console.error(err));
