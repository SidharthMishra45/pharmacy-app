import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  constructor(@Inject('APP_CONFIG') private config: any) {}

  getApiUrl(): string {
    return this.config.apiUrl;
  }

  getAppTitle(): string {
    return this.config.appTitle;
  }

  getVersion(): string {
    return this.config.version;
  }
}
