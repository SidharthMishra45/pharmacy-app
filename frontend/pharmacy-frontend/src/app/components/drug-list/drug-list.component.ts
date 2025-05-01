import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-drug-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatSnackBarModule
  ],
  templateUrl: './drug-list.component.html',
  styleUrls: ['./drug-list.component.scss']
})
export class DrugListComponent implements OnChanges {
  @Input() searchQuery: string = '';
  
  // Component properties
  drugs: any[] = [];
  isLoading: boolean = false;
  currentPage: number = 1;
  pageSize: number = 12;
  totalCount: number = 0;
  error: string | null = null;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private cartService: CartService
  ) {}

  // Calculate total pages
  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchQuery']) {
      this.currentPage = 1; // Reset to first page on new search
      this.fetchDrugs();
    }
  }

  // Generate page numbers for pagination
  getPages(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // Fetch drugs from API
  fetchDrugs(): void {
    this.isLoading = true;
    this.error = null;
    
    this.apiService.getFilteredDrugs(this.searchQuery, this.currentPage, this.pageSize)
      .subscribe({
        next: response => {
          this.drugs = response.items;
          this.totalCount = response.totalCount;
          this.isLoading = false;
        },
        error: err => {
          console.error('Error fetching drugs:', err);
          this.error = 'Failed to load medicines. Please try again later.';
          this.isLoading = false;
          this.drugs = [];
        }
      });
  }

  // Change current page
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.fetchDrugs();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Add drug to cart
  addToCart(drug: any): void {
    this.cartService.addToCart(drug);
    this.snackBar.open(`${drug.name} added to cart`, 'Close', {
      duration: 2000,
      panelClass: ['snackbar-success']
    });
  }

  // Reset search query
  resetSearch(): void {
    this.searchQuery = '';
    this.currentPage = 1;
    this.fetchDrugs();
  }
}