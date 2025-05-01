import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  order: any = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    
    if (orderId) {
      this.orderService.getOrderById(orderId).subscribe({
        next: (order) => {
          this.order = order;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching order:', err);
          this.error = 'Failed to load order details';
          this.toastService.showError(this.error);
          this.loading = false;
        }
      });
    } else {
      this.error = 'Invalid order ID';
      this.loading = false;
    }
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  viewOrders(): void {
    this.router.navigate(['/orders']);
  }
}