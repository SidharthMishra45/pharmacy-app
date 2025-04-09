import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appConfig } from '../config/app.config'; // Update path if needed
import { RegisterModel } from '../models/register.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${appConfig.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, {
      email,
      password,
    });
  }
  
  register(data: RegisterModel): Observable<any> {
    console.log('Payload being sent:', JSON.stringify(data, null, 2));
    return this.http.post(`${this.apiUrl}/register`, data);
  }
  

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
