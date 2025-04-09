import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../config/app.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = appConfig.apiUrl;

  constructor(private http: HttpClient) {}

  // Generic GET request
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`);
  }

  // Generic POST request
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data);
  }

  // Generic PUT request
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data);
  }

  // Generic DELETE request
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`);
  }

  getFilteredDrugs(searchTerm: string = '', page: number = 1, pageSize: number = 10): Observable<any> {
    const url = `${this.apiUrl}/Drugs/filter?searchTerm=${searchTerm}&page=${page}&pageSize=${pageSize}`;
    console.log('Calling API with URL:', url);  // 👈 Add this
    return this.http.get<any>(url);
  }
}
