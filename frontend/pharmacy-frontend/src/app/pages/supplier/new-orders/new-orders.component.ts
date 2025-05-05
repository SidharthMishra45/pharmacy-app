import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'; // ✅ Import AuthService

@Component({
  selector: 'app-new-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './new-orders.component.html',
  styleUrls: ['./new-orders.component.scss']
})
export class NewOrdersComponent implements OnInit {
  newOrders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading = true;
  searchQuery: string = '';
  showFilterDropdown = false;
  supplierId: string | null = null; // ✅ To hold supplier ID

  constructor(
    private orderService: OrderService,
    private authService: AuthService // ✅ Inject AuthService
  ) {}

  ngOnInit(): void {
    this.extractSupplierId(); // ✅ Get supplierId from token
    this.fetchNewOrders();
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

  fetchNewOrders(): void {
    this.isLoading = true;
    this.orderService.getOrdersByStatus('Pending').subscribe({
      next: (orders) => {
        this.newOrders = orders;
        this.sortOrders('latest');
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Failed to fetch orders.');
      }
    });
  }

  applyFilters(): void {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredOrders = this.newOrders.filter(order =>
      Array.isArray(order.items) &&
      order.items.some(item => item.drugName.toLowerCase().includes(query))
    );
  }

  toggleFilterDropdown(): void {
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  sortOrders(order: 'latest' | 'oldest'): void {
    this.newOrders.sort((a, b) => {
      const dateA = new Date(a.orderDate).getTime();
      const dateB = new Date(b.orderDate).getTime();
      return order === 'latest' ? dateB - dateA : dateA - dateB;
    });
    this.applyFilters();
  }

  acceptOrder(orderId: string): void {
    if (!this.supplierId) {
      alert('Unable to accept order: Supplier ID not found.');
      return;
    }
  
    this.orderService.acceptOrder(orderId, this.supplierId).subscribe({
      next: () => {
        this.fetchNewOrders();
      },
      error: () => {
        alert('Failed to accept the order.');
      }
    });
  }
  

  rejectOrder(orderId: string): void {
    if (!this.supplierId) {
      alert('Unable to reject order: Supplier ID not found.');
      return;
    }
  
    this.orderService.rejectOrder(orderId, this.supplierId).subscribe({
      next: () => {
        this.fetchNewOrders();
      },
      error: () => {
        alert('Failed to reject the order.');
      }
    });
  }
}
