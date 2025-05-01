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

  getSupplierInventory(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.apiUrl);
  }

  getAllInventoriesForAdmin(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.apiUrl}/all`);
  }
  

  addInventory(inventory: Inventory): Observable<Inventory> {
    return this.http.post<Inventory>(this.apiUrl, inventory);
  }

  updateInventory(id: string, inventory: Inventory): Observable<Inventory> {
    return this.http.put<Inventory>(`${this.apiUrl}/${id}`, inventory);
  }

  deleteInventory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
