import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../../../services/inventory.service';
import { Inventory } from '../../../../models/inventory.model';

@Component({
  selector: 'app-inventory-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory-report.component.html',
  styleUrls: ['./inventory-report.component.scss']
})
export class InventoryReportComponent implements OnInit {
  inventoryList: Inventory[] = [];
  isLoading = true;
  error: string = '';

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.fetchAllInventories();
  }

  fetchAllInventories(): void {
    this.inventoryService.getAllInventoriesForAdmin().subscribe({
      next: (data) => {
        this.inventoryList = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch inventory data.';
        this.isLoading = false;
      }
    });
  }
}
