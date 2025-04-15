import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-new-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './new-orders.component.html',
  styleUrls: ['./new-orders.component.scss']
})
export class NewOrdersComponent implements OnInit {
  newOrders: Order[] = [];
  isLoading = true;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchNewOrders();
  }

  fetchNewOrders(): void {
    this.isLoading = true;
    this.orderService.getOrdersByStatus('Pending').subscribe({
      next: (orders) => {
        this.newOrders = orders;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Failed to fetch orders.');
      }
    });
  }

  acceptOrder(orderId: string): void {
    this.orderService.updateOrderStatus(orderId, 'Accepted').subscribe(() => {
      this.fetchNewOrders(); // Refresh the list
    });
  }

  rejectOrder(orderId: string): void {
    this.orderService.updateOrderStatus(orderId, 'Rejected').subscribe(() => {
      this.fetchNewOrders(); // Refresh the list
    });
  }
}
