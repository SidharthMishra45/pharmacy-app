export interface Inventory {
  inventoryId?: string;
  drugName: string;
  quantity: number;
  price: number;
  expiryDate: string; // ISO format (e.g., "2025-04-12T00:00:00Z")
  supplierId?: string;
  supplierName?: string;
}
