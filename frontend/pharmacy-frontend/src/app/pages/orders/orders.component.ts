import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service'; // use service directly

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  showSuccessMessage = false;

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    this.showSuccessMessage = nav?.extras?.state?.['success'] || false;
    this.fetchOrders();
  }

  fetchOrders() {
    this.orderService.getMyOrders().subscribe({
      next: (data) => this.orders = data,
      error: (err) => console.error('Error fetching orders', err)
    });
  }
}
