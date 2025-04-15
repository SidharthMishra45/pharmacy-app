import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-drug-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './drug-list.component.html',
  styleUrls: ['./drug-list.component.scss'],
})
export class DrugListComponent implements OnInit, OnChanges {
  @Input() searchQuery: string = '';

  drugs: any[] = [];
  totalCount: number = 0;
  showAddForm = false;
  editMode = false;
  editingDrugId: string | null = null;

  newDrug: any = {
    name: '',
    manufacturer: '',
    description: '',
    categoryName: '',
    price: 0
  };

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    if (!this.searchQuery) {
      this.fetchDrugs();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchQuery'] && !changes['searchQuery'].firstChange) {
      const newSearchTerm = changes['searchQuery'].currentValue;
      this.fetchDrugs(newSearchTerm);
    }
  }

  fetchDrugs(searchTerm: string = '', page: number = 1, pageSize: number = 10): void {
    this.apiService.getFilteredDrugs(searchTerm, page, pageSize).subscribe({
      next: response => {
        this.drugs = response.items;
        this.totalCount = response.totalCount;
      },
      error: err => {
        console.error('Error fetching drugs:', err);
      }
    });
  }

  // ✅ In addDrug(), adjust validation and payload
  addDrug(): void {
    if (!this.newDrug.name || !this.newDrug.price || !this.newDrug.categoryName) {
      this.snackBar.open('Please fill in all required fields.', 'Close', { duration: 3000 });
      return;
    }

    this.apiService.addDrug(this.newDrug).subscribe({
      next: (data) => {
        this.snackBar.open('Drug added successfully!', 'Close', { duration: 3000 });
        this.fetchDrugs(); // better than pushing manually
        this.newDrug = { name: '', description: '', price: 0, categoryName: '' };
        this.showAddForm = false;
      },
      error: (err) => {
        console.error('Add drug failed:', err);
        this.snackBar.open('Failed to add drug.', 'Close', { duration: 3000 });
      }
    });
  }


  // ✅ In editDrug()
  editDrug(drug: any): void {
    this.newDrug = {
      name: drug.name,
      description: drug.description,
      price: drug.price,
      categoryName: drug.categoryName // ✅ Not categoryId
    };
    this.editMode = true;
    this.editingDrugId = drug.drugId;
    this.showAddForm = true;
  }


  updateDrug(): void {
    if (!this.editingDrugId) return;

    this.apiService.updateDrug(this.editingDrugId, this.newDrug).subscribe({
      next: () => {
        this.snackBar.open('Drug updated successfully!', 'Close', { duration: 3000 });
        this.fetchDrugs();
        this.cancelForm();
      },
      error: (err) => {
        console.error('Update failed:', err);
        this.snackBar.open('Failed to update drug.', 'Close', { duration: 3000 });
      }
    });
  }

  deleteDrug(id: string): void {
    if (confirm('Are you sure you want to delete this drug?')) {
      this.apiService.deleteDrug(id).subscribe({
        next: () => {
          this.snackBar.open('Drug deleted.', 'Close', { duration: 3000 });
          this.drugs = this.drugs.filter(d => d.drugId !== id);
        },
        error: (err) => {
          console.error('Delete failed:', err);
        }
      });
    }
  }

  // ✅ In cancelForm()
  cancelForm(): void {
    this.showAddForm = false;
    this.editMode = false;
    this.editingDrugId = null;
    this.newDrug = { name: '', description: '', price: 0, categoryName: '' };
  }

}
