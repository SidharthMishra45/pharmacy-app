import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms'; // 
import { Router } from '@angular/router';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;
  filteredCartItems: any[] = [];
  searchQuery: string = '';

  private cartSub!: Subscription;
  constructor(private cartService: CartService,private router: Router) {}

  ngOnInit(): void {
    this.cartSub = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal(); 
      this.filterItems(); 
    });
  }

  filterItems(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredCartItems = this.cartItems.filter(item =>
      item.name.toLowerCase().includes(query)
    );
    this.calculateTotal(); 
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  removeFromCart(drugId: string): void {
    this.cartService.removeFromCart(drugId);
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotal();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.cartItems = [];
    this.totalAmount = 0;
  }

  increaseQuantity(drugId: string): void {
    this.cartService.increaseQuantity(drugId);
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotal();
  }

  decreaseQuantity(drugId: string): void {
    this.cartService.decreaseQuantity(drugId);
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotal();
  }

  goToHome() {
    this.router.navigate(['/']); 
  }


  proceedToBuy(): void {
    alert('Redirecting to payment (to be implemented)');
  }
}
