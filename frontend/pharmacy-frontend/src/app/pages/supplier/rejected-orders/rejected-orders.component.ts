import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; // ✅ Import AuthService

@Component({
  selector: 'app-rejected-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rejected-orders.component.html',
  styleUrls: ['./rejected-orders.component.scss']
})
export class RejectedOrdersComponent implements OnInit {
  rejectedOrders: Order[] = [];
  isLoading = true;
  supplierId: string | null = null; // ✅ Store supplier ID

  constructor(
    private orderService: OrderService,
    private authService: AuthService // ✅ Inject AuthService
  ) {}

  ngOnInit(): void {
    this.extractSupplierId(); // ✅ Extract supplier ID from JWT
    this.fetchRejectedOrders();
  }

  extractSupplierId(): void {
    const token = this.authService.getToken();
    if (token) {
      try {
        const decoded = this.decodeToken(token);
        this.supplierId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }

  decodeToken(token: string): any {
    const payload = atob(token.split('.')[1]);
    return JSON.parse(payload);
  }

  fetchRejectedOrders(): void {
    this.isLoading = true;

    if (this.supplierId) {
      this.orderService.getMyRejectedOrders(this.supplierId,).subscribe({
        next: (orders) => {
          this.rejectedOrders = orders;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          alert('Failed to fetch rejected orders.');
        }
      });
    } else {
      this.isLoading = false;
      alert('Supplier ID not found.');
    }
  }
}
