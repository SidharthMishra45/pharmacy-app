import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; // ✅ Import AuthService

@Component({
  selector: 'app-picked-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './picked-orders.component.html',
  styleUrls: ['./picked-orders.component.scss']
})
export class PickedOrdersComponent implements OnInit {
  pickedOrders: Order[] = [];
  isLoading = true;
  supplierId: string | null = null; // ✅ To hold supplier ID

  constructor(
    private orderService: OrderService,
    private authService: AuthService // ✅ Inject AuthService
  ) {}

  ngOnInit(): void {
    this.extractSupplierId(); // ✅ Get supplierId from token
    this.fetchPickedOrders();
  }

  extractSupplierId(): void {
    const token = this.authService.getToken();
    if (token) {
      try {
        const decoded = this.decodeToken(token);
        this.supplierId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      } catch (e) {
        console.error('Failed to decode token:', e);
      }
    }
  }

  decodeToken(token: string): any {
    const parts = token.split('.');
    const payload = atob(parts[1]);
    return JSON.parse(payload);
  }

  fetchPickedOrders(): void {
    this.isLoading = true;
  
    if (this.supplierId) {
      this.orderService.getMyAcceptedOrders(this.supplierId).subscribe({
        next: (orders) => {
          this.pickedOrders = orders;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          alert('Failed to fetch picked orders.');
        }
      });
    } else {
      this.isLoading = false;
      alert('Supplier ID not found.');
    }
  }
  
}
