import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { appConfig } from '../config/app.config';
import { catchError, Observable, throwError } from 'rxjs';
import { Order } from '../models/order.model'; // Adjust path if needed
import { AuthService } from './auth.service'; // Add this import

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${appConfig.apiUrl}/order`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Get the token from AuthService
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  }

  // Place a new order
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

  // Admin-only: Get all orders
  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  // Get orders by status (supplier role)
  getOrdersByStatus(status: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/status?status=${status}`, {
      headers: this.getHeaders(),
    });
  }

  // Get order by ID
  getOrderById(orderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${orderId}`, {
      headers: this.getHeaders(),
    });
  }

  // Update order status
  updateOrderStatus(orderId: string, status: string, supplierId?: string): Observable<void> {
    let params = new HttpParams().set('status', status);
    
    // If status is "Accepted", include supplierId as a query parameter
    if (status === 'Accepted' && supplierId) {
      params = params.set('supplierId', supplierId);
    }

    return this.http.put<void>(`${this.apiUrl}/${orderId}/status`, {}, {
      headers: this.getHeaders(),
      params: params,
    });
  }

  // Supplier: Accept an order
  acceptOrder(orderId: string, supplierId?: string): Observable<any> {
    let params = new HttpParams();
  
    if (supplierId) {
      params = params.set('supplierId', supplierId);
    }
  
    return this.http.put(`${this.apiUrl}/${orderId}/accept`, {}, {
      headers: this.getHeaders(),
      params: params   // ✅ This was missing
    }).pipe(
      catchError(err => {
        console.error('Error accepting order:', err);
        return throwError(err);
      })
    );
  }

  rejectOrder(orderId: string, supplierId?: string): Observable<any> {
    let params = new HttpParams();
  
    if (supplierId) {
      params = params.set('supplierId', supplierId);
    }
  
    return this.http.put(`${this.apiUrl}/${orderId}/reject`, {}, {
      headers: this.getHeaders(),
      params: params   
    }).pipe(
      catchError(err => {
        console.error('Error rejecting order:', err);
        return throwError(err);
      })
    );
  }
  

  // Get orders accepted by the logged-in supplier
  getMyAcceptedOrders(supplierId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/supplier/${supplierId}/accepted`, {
      headers: this.getHeaders(),
    });
  }

  getMyRejectedOrders(supplierId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/supplier/${supplierId}/rejected`, {
      headers: this.getHeaders(),
    });
  }

  
  

  getOrdersBySupplierAndStatus(supplierId: string, status: string) {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/supplier/${supplierId}/status/${status}`);
  }
  
}
