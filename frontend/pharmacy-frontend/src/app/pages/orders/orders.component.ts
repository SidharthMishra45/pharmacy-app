import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  showSuccessMessage: boolean = false;
  searchQuery: string = '';

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    this.showSuccessMessage = nav?.extras?.state?.['success'] || false;
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.loading = true;
    this.error = null;
    
    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        // Sort orders by date (newest first)
        this.orders = data.sort((a, b) => {
          return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching orders', err);
        this.error = 'Failed to load orders. Please try again later.';
        this.loading = false;
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-success';
      case 'pending':
        return 'bg-warning';
      case 'cancelled':
        return 'bg-danger';
      case 'shipped':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  filterOrders(): void {
    if (!this.searchQuery.trim()) {
      this.fetchOrders();
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.orders = this.orders.filter(order => 
      order.orderId.toLowerCase().includes(query) ||
      order.orderItems.some((item: any) => 
        item.drugName.toLowerCase().includes(query)
      )
    );
  }
}