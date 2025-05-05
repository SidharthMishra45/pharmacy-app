import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../../services/inventory.service';
import { Inventory } from '../../../models/inventory.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  inventories: Inventory[] = [];
  loading: boolean = true;

  // Form states
  showAddForm = false;
  editMode = false;
  editItem!: Inventory;

  // New inventory form object
  newInventory: Partial<Inventory> = {
    drugName: '',
    quantity: 0,
    price: 0,
    expiryDate: '',
    categoryName: '',  // Add category
    description: ''  // Add description
  };

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.fetchInventory();
  }

  // Toggle add form
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.editMode = false;
    this.resetNewInventory();
  }

  // Fetch current supplier's inventory
  fetchInventory(): void {
    this.loading = true;
    this.inventoryService.getSupplierInventory().subscribe({
      next: (data) => {
        this.inventories = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching inventory:', err);
        this.loading = false;
        alert('Failed to load inventory.');
      }
    });
  }

  // Add new inventory
  addInventory(): void {
    const { drugName, quantity, price, expiryDate, categoryName, description } = this.newInventory;
    if (!drugName || !quantity || !price || !expiryDate || !categoryName || !description) {
      alert('Please fill all fields.');
      return;
    }

    this.inventoryService.addInventory(this.newInventory as Inventory).subscribe({
      next: (data) => {
        this.inventories.push(data);
        this.resetNewInventory();
        this.showAddForm = false;
      },
      error: (err) => {
        console.error('Error adding inventory:', err);
        alert('Failed to add inventory.');
      }
    });
  }

  // Start editing inventory
  editInventory(item: Inventory): void {
    this.editItem = { ...item };
    this.editMode = true;
    this.showAddForm = false;
  }

  // Cancel edit
  cancelEdit(): void {
    this.editMode = false;
  }

  // Update existing inventory
  updateInventory(): void {
    const { inventoryId, drugName, quantity, price, expiryDate, categoryName, description } = this.editItem;
    if (!drugName || !quantity || !price || !expiryDate || !categoryName || !description) {
      alert('Please fill all fields.');
      return;
    }

    const category = this.editItem.categoryName || '';
    this.inventoryService.updateInventory(inventoryId, { ...this.editItem, categoryName }).subscribe({      next: () => {
        this.fetchInventory();
        this.editMode = false;
      },
      error: (err) => {
        console.error('Error updating inventory:', err);
        alert('Failed to update inventory.');
      }
    });
  }

  // Delete inventory item
  deleteInventory(id: string): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.inventoryService.deleteInventory(id).subscribe({
        next: () => {
          this.inventories = this.inventories.filter(i => i.inventoryId !== id);
        },
        error: (err) => {
          console.error('Error deleting inventory:', err);
          alert('Failed to delete inventory.');
        }
      });
    }
  }

  // Reset new inventory form
  private resetNewInventory(): void {
    this.newInventory = {
      drugName: '',
      quantity: 0,
      price: 0,
      expiryDate: '',
      categoryName: '',
      description: ''
    };
  }
}
