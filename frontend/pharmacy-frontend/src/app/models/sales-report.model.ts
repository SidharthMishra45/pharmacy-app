export interface SalesReportRequestDto {
    supplierId: string;
    fromDate: string;
    toDate: string;
  }
  
  export interface SalesReportResponseDto {
    date:        string;  // ISO string of Date
    totalOrders: number;
    totalRevenue: number;
  }
  
  export interface SupplierSalesReportRequestDto {
    supplierId: string;
    fromDate?: string; // ISO string, optional
    toDate?: string;   // ISO string, optional
  }
  
  export interface SupplierSalesReportItemDto {
    orderNumber: string;
    drugName: string;
    quantity: number;
    pricePerUnit: number;
    totalDrugPrice: number;
    totalOrderPrice: number;
  }
  
  
  