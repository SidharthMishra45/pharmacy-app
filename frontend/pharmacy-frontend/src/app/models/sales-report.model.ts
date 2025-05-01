export interface SalesReportRequestDto {
    supplierId: string;
    fromDate: string;
    toDate: string;
  }
  
  export interface SalesReportItem {
    drugNames: string[]; // If the API returns an array of drug names
    quantity: number;
    price: number;
    orderDate: string; // or Date
    supplierName: string;
  }
  
  
  