import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../config/app.config';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model'; // Adjust path if needed

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${appConfig.apiUrl}/order`;

  constructor(private http: HttpClient) {}

  // Place a new order
  placeOrder(order: any): Observable<any> {
    return this.http.post(this.apiUrl, order);
  }

  // Get current logged-in doctor's orders
  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-orders`);
  }

  // (Optional) Get all orders - admin access
  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getOrdersByStatus(status: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/status?status=${status}`);
  }
  

  updateOrderStatus(orderId: string, status: string): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${orderId}/status`,
      {}, 
      {
        params: { status },
      }
    );
  }
  
  

}
