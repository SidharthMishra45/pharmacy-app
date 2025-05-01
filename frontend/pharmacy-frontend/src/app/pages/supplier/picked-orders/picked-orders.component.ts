import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';
import { RouterModule } from '@angular/router';

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

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchPickedOrders();
  }

  fetchPickedOrders(): void {
    this.isLoading = true;
    this.orderService.getOrdersByStatus('Accepted').subscribe({
      next: (orders) => {
        this.pickedOrders = orders;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Failed to fetch picked orders.');
      }
    });
  }
}
