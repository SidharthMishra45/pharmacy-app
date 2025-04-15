import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service'; 

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

  constructor(
    private cartService: CartService,
    private orderService: OrderService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  makePayment(): void {
    this.placingOrder = true;

    const order = {
      totalAmount: this.totalAmount,
      orderItems: this.cartItems.map(item => ({
        drugId: item.drugId,
        quantity: item.quantity
      }))
    };
  
    this.orderService.placeOrder(order).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.router.navigate(['/orders'], { state: { success: true } });
      },
      error: (err) => {
        this.placingOrder = false;
        alert('Failed to place order. Try again later.');
        console.error(err);
      }
    });
  }
}
