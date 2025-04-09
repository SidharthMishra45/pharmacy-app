// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: any[] = [];
  private cartItemsSubject = new BehaviorSubject<any[]>(this.cartItems); // New BehaviorSubject for cart items
  cartItems$ = this.cartItemsSubject.asObservable(); 
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor() {}

  addToCart(drug: any) {
    const existingItem = this.cartItems.find(item => item.drugId === drug.drugId);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({ ...drug, quantity: 1 });
    }
    this.cartItemsSubject.next(this.cartItems);  // Emit updated cart items

    this.cartCountSubject.next(this.getCartCount());
  }
  
  getCartCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  getCartItems(): any[] {
    return this.cartItems;
  }
  
  
  increaseQuantity(drugId: string) {
    const item = this.cartItems.find(i => i.drugId === drugId);
    if (item) item.quantity++;
    this.cartItemsSubject.next(this.cartItems);  // Emit updated cart items

    this.cartCountSubject.next(this.getCartCount());
  }
  
  decreaseQuantity(drugId: string) {
    const item = this.cartItems.find(i => i.drugId === drugId);
    if (item) {
      item.quantity--;
      if (item.quantity <= 0) {
        this.removeFromCart(drugId);
      }
    }
    this.cartItemsSubject.next(this.cartItems);  // Emit updated cart items

    this.cartCountSubject.next(this.getCartCount());
  }
  removeFromCart(drugId: string) {
    const index = this.cartItems.findIndex(item => item.drugId === drugId);
    if (index !== -1) {
      this.cartItems.splice(index, 1); // Remove only one matching item
      this.cartItemsSubject.next(this.cartItems);  // Emit updated cart items

      this.cartCountSubject.next(this.cartItems.length);
    }
  }
  

  clearCart() {
    this.cartItems = [];
    this.cartItemsSubject.next(this.cartItems);  // Emit updated cart items
    this.cartCountSubject.next(0); // Reset cart count

  }
}
