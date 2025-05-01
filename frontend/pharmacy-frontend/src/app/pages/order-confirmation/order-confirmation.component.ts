import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;
  placingOrder: boolean = false;
  orderError: string = ''; // Changed from string | null to string

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartItems = this.cartService.getCartItems();
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
      return;
    }
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity), 0
    );
  }

  makePayment(): void {
    this.placingOrder = true;
    this.orderError = '';
  
    const order = {
      totalAmount: this.totalAmount,
      orderItems: this.cartItems.map(item => ({
        drugId: item.drugId,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      orderDate: new Date().toISOString()
    };
  
    this.orderService.placeOrder(order).subscribe({
      next: (response) => {
        this.cartService.clearCart();
        this.toastService.showSuccess('Order placed successfully!');
        this.router.navigate(['/orders', response.orderId], { 
          state: { 
            success: true,
            orderDetails: response
          } 
        });
      },
      error: (err) => {
        console.error('Order error:', err);
        this.placingOrder = false;
        
        if (err.status === 401 || err.status === 403) {
          this.orderError = 'Please login again to place your order';
          this.router.navigate(['/login']); // Redirect to login if unauthorized
        } else {
          this.orderError = err.error?.message || 'Failed to place order. Please try again.';
        }
        
        this.toastService.showError(this.orderError);
      }
    });
  }
  
  goBack(): void {
    this.router.navigate(['/cart']);
  }
}