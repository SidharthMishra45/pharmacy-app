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
  
  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      const decodedToken = this.decodeToken(token);
      const currentTime = Date.now() / 1000; // in seconds
  
      // Check if token is expired
      if (decodedToken.exp < currentTime) {
        this.logout(); // Automatically logout if token is expired
        return null;
      }
  
      console.log('Decoded token payload:', decodedToken);
      return decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

  getAllSuppliers(): Observable<any[]> {
    return this.http.get<any[]>(`${appConfig.apiUrl}/Users/getsuppliers`);
  }
  
  
  private decodeToken(token: string): any {
    const parts = token.split('.');
    const payload = atob(parts[1]);
    return JSON.parse(payload);
  }
  
  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      const decodedToken = this.decodeToken(token);
      const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      return userId || null;
    } catch (e) {
      console.error('Failed to decode token for user ID', e);
      return null;
    }
  }
  
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
  
    try {
      const decodedToken = this.decodeToken(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch (err) {
      return false;
    }
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
