import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export interface AppConfig {
  apiUrl: string;
  appTitle: string;
  version: string;
}

// The configuration values
export const appConfig: AppConfig = {
  apiUrl: 'http://localhost:5057/api', // Backend API URL
  appTitle: 'Pharmacy Management System',
  version: '1.0.0',
};

// Provide HTTP Client and Routing
export const appProviders: ApplicationConfig = {
  providers: [provideHttpClient(), provideRouter(routes)],
};
