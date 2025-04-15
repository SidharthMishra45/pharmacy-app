import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

export interface AppConfig {
  apiUrl: string;
  appTitle: string;
  version: string;
}

export const appConfig: AppConfig = {
  apiUrl: 'http://localhost:5057/api',
  appTitle: 'Pharmacy Management System',
  version: '1.0.0',
};

export const appProviders: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()), 
    provideRouter(routes),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
};
