import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/api.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core'; 
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-drug-list',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './drug-list.component.html',
  styleUrls: ['./drug-list.component.scss'], 
})
export class DrugListComponent implements OnInit, OnChanges {  
  @Input() searchQuery: string = '';

  drugs: any[] = []; 
  filteredDrugs: any[] = [];
  totalCount: number = 0; 

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private cartService: CartService 
  ) {}

  ngOnInit() : void {
    if (!this.searchQuery) {
      this.fetchDrugs(); 
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchQuery'] && !changes['searchQuery'].firstChange) {
      const newSearchTerm = changes['searchQuery'].currentValue;
      console.log('Search query changed to:', newSearchTerm);
      this.fetchDrugs(newSearchTerm);
    }
  }

  fetchDrugs(searchTerm: string = '', page: number = 1, pageSize: number = 10): void {
    console.log('Fetching drugs with search term:', searchTerm);
    this.apiService.getFilteredDrugs(searchTerm, page, pageSize).subscribe({
      next: response => {
        console.log('Drug API Response:', response);
        this.drugs = response.items;
        this.totalCount = response.totalCount;
      },
      error: err => {
        console.error('Error fetching drugs:', err);
      }
    });
  }

  addToCart(drug: any) {
    this.cartService.addToCart(drug);
    this.snackBar.open(`${drug.name} added to cart`, 'Close', {
      duration: 2000,
    });
  }
}
