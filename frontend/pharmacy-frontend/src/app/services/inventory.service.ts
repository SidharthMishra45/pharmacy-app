import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventory } from '../models/inventory.model';
import { appConfig } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = `${appConfig.apiUrl}/inventory`;

  constructor(private http: HttpClient) {}

  // Supplier: Get own inventory
  getSupplierInventory(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.apiUrl);
  }

  // Admin only: Get all inventories across suppliers
  getAllInventoriesForAdmin(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.apiUrl}/all`);
  }

  // Supplier: Get specific inventory by ID
  getInventoryById(id: string): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.apiUrl}/${id}`);
  }

  addInventory(inventory: Inventory): Observable<Inventory> {
    return this.http.post<Inventory>(`${this.apiUrl}`, inventory);
  }
  
  updateInventory(id: string, inventory: Inventory): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, inventory);
  }
  // Supplier: Delete inventory
  deleteInventory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
