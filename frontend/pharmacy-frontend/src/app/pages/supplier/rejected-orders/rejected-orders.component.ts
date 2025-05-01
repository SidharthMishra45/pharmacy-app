import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';
import { RouterModule } from '@angular/router';

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

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchRejectedOrders();
  }

  fetchRejectedOrders(): void {
    this.isLoading = true;
    this.orderService.getOrdersByStatus('Rejected').subscribe({
      next: (orders) => {
        this.rejectedOrders = orders;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Failed to fetch rejected orders.');
      }
    });
  }
}
