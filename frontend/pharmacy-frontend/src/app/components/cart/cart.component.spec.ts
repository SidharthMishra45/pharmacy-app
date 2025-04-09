import { Component, OnInit, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,  // Ensure it's a standalone component
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'], // Use SCSS instead of CSS
  providers: [CartService] // Explicitly provide CartService
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];

  private cartService = inject(CartService); // Injecting service without constructor

  ngOnInit() {
    this.cartItems = this.cartService.getCartItems();
  }

  proceedToBuy() {
    alert('Redirecting to payment gateway...');
  }
}
