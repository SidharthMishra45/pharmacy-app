import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../../services/inventory.service';
import { Inventory } from '../../../models/inventory.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  inventories: Inventory[] = [];
  loading: boolean = true;
  showAddForm: boolean = false;
  editMode: boolean = false;
  editItem!: Inventory;

  newInventory: Partial<Inventory> = {
    drugName: '',
    quantity: 0,
    price: 0,
    expiryDate: ''
  };

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.fetchInventory();
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.editMode = false;
    this.resetNewInventory();
  }

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
      }
    });
  }

  addInventory(): void {
    if (!this.newInventory.drugName || !this.newInventory.quantity || !this.newInventory.price || !this.newInventory.expiryDate) {
      alert('Please fill all fields');
      return;
    }

    this.inventoryService.addInventory(this.newInventory as Inventory).subscribe({
      next: (data) => {
        this.inventories.push(data);
        this.newInventory = { drugName: '', quantity: 0, price: 0, expiryDate: '' };
        this.showAddForm = false;
      },
      error: (err) => {
        console.error('Error adding inventory:', err);
        alert('Failed to add inventory item.');
      }
    });
  }

  editInventory(item: Inventory): void {
    this.editItem = { ...item };
    this.editMode = true;
    this.showAddForm = false;

  }

  cancelEdit(): void {
    this.editMode = false;
  }

  updateInventory(): void {
    this.inventoryService.updateInventory(this.editItem.inventoryId!, this.editItem).subscribe({
      next: () => {
        this.fetchInventory();
        this.editMode = false;
      },
      error: (err) => {
        console.error('Update failed:', err);
      }
    });
  }

  deleteInventory(id: string): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.inventoryService.deleteInventory(id).subscribe({
        next: () => {
          this.inventories = this.inventories.filter(item => item.inventoryId !== id);
        },
        error: (err) => {
          console.error('Delete failed:', err);
        }
      });
    }
  }

  private resetNewInventory(): void {
    this.newInventory = {
      drugName: '',
      quantity: 0,
      price: 0,
      expiryDate: ''
    };
  }
}
