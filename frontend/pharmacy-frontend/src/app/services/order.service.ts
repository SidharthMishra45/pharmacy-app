import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { appConfig } from '../config/app.config';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model'; // Adjust path if needed
import { AuthService } from './auth.service'; // Add this import

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${appConfig.apiUrl}/order`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Place a new order
  private getHeaders(): HttpHeaders {
    // Get the token from AuthService
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  }

  placeOrder(order: any): Observable<any> {
    return this.http.post(this.apiUrl, order, {
      headers: this.getHeaders(),
    });
  }

  // Get current logged-in doctor's orders
  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-orders`, {
      headers: this.getHeaders(),
    });
  }

  // (Optional) Get all orders - admin access
  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getOrdersByStatus(status: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/status?status=${status}`, {
      headers: this.getHeaders(),
    });
  }

  getOrderById(orderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${orderId}`, {
      headers: this.getHeaders(),
    });
  }

  updateOrderStatus(orderId: string, status: string, supplierId?: string): Observable<void> {
    let params = new HttpParams().set('status', status);
    
    // If status is "Accepted", add supplierId as query parameter
    if (status === 'Accepted' && supplierId) {
      params = params.set('supplierId', supplierId);
    }

    return this.http.put<void>(`${this.apiUrl}/${orderId}/status`, {}, {
      headers: this.getHeaders(),
      params: params,
    });
  }
}
