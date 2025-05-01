import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrugListComponent } from '../../components/drug-list/drug-list.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { FormsModule } from '@angular/forms'; // Add this import
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, FormsModule, NavbarComponent, DrugListComponent, FooterComponent],
})
export class HomeComponent implements OnInit {
  searchQuery: string = '';
  categories: Category[] = [];
  searchInputValue: string = '';

  // Map category names to Bootstrap Icons
  private categoryIcons: { [key: string]: string } = {
    'Stomach ache': 'bi-stomach',
    'Stomach pain': 'bi-stomach',
    'liver': 'bi-organ',
    'Pain Reliever': 'bi-pain',
    'Headache': 'bi-head-side-virus',
    'Antibiotic': 'bi-capsule',
    // Add more mappings as needed
  };

  constructor(private categoryService: CategoryService,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  onSearch(query: string) {
    this.searchQuery = query;
  }

  fetchCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        // Add icons to each category
        this.categories = categories.map(category => ({
          ...category,
          icon: this.categoryIcons[category.categoryName] || 'bi-capsule' // default icon
        }));
      },
      error: (error) => {
        console.error('Error fetching categories', error);
      }
    });
  }

  onCategoryClick(categoryName: string) {
    this.searchQuery = categoryName;
  }

  viewAllCategories() {
    this.searchQuery = '';
    // Alternatively, navigate to a dedicated categories page:
    // this.router.navigate(['/categories']);
  }

  // New method to view all medicines
  viewAllMedicines() {
    this.searchQuery = '';
    // Alternatively, navigate to a dedicated medicines page:
    // this.router.navigate(['/medicines']);
  }

  // Helper method to get icon for a category
  getCategoryIcon(categoryName: string): string {
    return this.categoryIcons[categoryName] || 'bi-capsule';
  }
}