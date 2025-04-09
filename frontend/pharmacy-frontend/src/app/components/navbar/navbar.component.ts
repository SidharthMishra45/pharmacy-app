import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms'; // 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule], // 
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  cartCount: number = 0;
  searchQuery: string = '';

  @Output() searchPerformed = new EventEmitter<string>(); 

  constructor(private router: Router, public cartService: CartService) {
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  onSearch() {
    this.searchPerformed.emit(this.searchQuery);
    console.log('Searching for:', this.searchQuery);
    // 🔥 Emit search text
  }

  viewCart() {
    this.router.navigate(['/cart']);
  }
}
