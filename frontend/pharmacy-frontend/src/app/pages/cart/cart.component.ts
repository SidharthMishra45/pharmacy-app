import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule], // Removed ng-bootstrap-icons
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: any[] = [];
  filteredCartItems: any[] = [];
  searchQuery: string = '';
  totalAmount: number = 0;
  isLoading: boolean = true;

  private cartSub!: Subscription;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.cartSub = this.cartService.cartItems$.subscribe({
      next: (items) => {
        this.cartItems = items;
        this.filterItems();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading cart items:', err);
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

  

  loadCartItems(): void {
    this.isLoading = true;
    try {
      this.cartItems = this.cartService.getCartItems();
      this.filterItems();
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      this.isLoading = false;
    }
  }

  filterItems(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredCartItems = query 
      ? this.cartItems.filter(item => 
          item.name.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query)))
      : [...this.cartItems];
    
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalAmount = this.filteredCartItems.reduce(
      (total, item) => total + (item.price * item.quantity), 0
    );
  }

  increaseQuantity(drugId: string): void {
    this.cartService.increaseQuantity(drugId);
  }

  decreaseQuantity(drugId: string): void {
    this.cartService.decreaseQuantity(drugId);
  }

  removeFromCart(drugId: string): void {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      this.cartService.removeFromCart(drugId);
    }
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      this.cartService.clearCart();
    }
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  proceedToBuy(): void {
    if (this.filteredCartItems.length > 0) {
      this.router.navigate(['/order-confirmation']);
    }
  }
}