import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

import { SalesReportService } from '../../../services/sales-report.service';
import { AuthService } from '../../../services/auth.service';
import {
  SupplierSalesReportRequestDto,
  SupplierSalesReportItemDto
} from '../../../models/sales-report.model';

@Component({
  selector: 'app-supplier-sales-report',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './supplier-sales-report.component.html',
  styleUrls: ['./supplier-sales-report.component.scss']
})
export class SupplierSalesReportComponent implements OnInit {
  fromDate = '';
  toDate = '';
  salesReport: SupplierSalesReportItemDto[] = [];
  salesReportGrouped: {
    orderNumber: string;
    totalOrderPrice: number;
    items: {
      drugName: string;
      quantity: number;
      pricePerUnit: number;
      totalDrugPrice: number;
    }[];
  }[] = [];
  isLoading = false;
  minDate = '';
  supplierId = '';

  constructor(
    private salesReportService: SalesReportService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.minDate = new Date(2000, 0, 1).toISOString().split('T')[0];
    const userId = this.authService.getUserId();
    if (!userId) {
      alert('Unauthorized access. Please login again.');
      return;
    }
    this.supplierId = userId;
  }

  fetchReport(): void {
    if (!this.fromDate || !this.toDate) {
      alert('Please fill in both date fields.');
      return;
    }

    const request: SupplierSalesReportRequestDto = {
      supplierId: this.supplierId,
      fromDate: this.fromDate,
      toDate: this.toDate
    };

    this.isLoading = true;
    this.salesReportService.getSupplierSalesReport(request).subscribe({
      next: (data) => {
        this.salesReport = data;
        this.groupSalesByOrder();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Failed to fetch sales report.');
      }
    });
  }

  private groupSalesByOrder(): void {
    const map = new Map<string, {
      orderNumber: string;
      totalOrderPrice: number;
      items: {
        drugName: string;
        quantity: number;
        pricePerUnit: number;
        totalDrugPrice: number;
      }[];
    }>();
  
    for (const item of this.salesReport) {
      if (!map.has(item.orderNumber)) {
        map.set(item.orderNumber, {
          orderNumber: item.orderNumber,
          totalOrderPrice: 0, // Initialize total price for each order
          items: []
        });
      }
      // Add the item to the appropriate order group
      map.get(item.orderNumber)?.items.push({
        drugName: item.drugName,
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit,
        totalDrugPrice: item.totalDrugPrice
      });
  
      // Update the total price for the order
      const currentOrder = map.get(item.orderNumber);
      if (currentOrder) {
        currentOrder.totalOrderPrice += item.totalDrugPrice; // Add the drug's total price to the order's total
      }
    }
  
    // Assign the grouped data to the salesReportGrouped
    this.salesReportGrouped = Array.from(map.values());
  }
  

  downloadReport(): void {
    try {
      const doc = new jsPDF();
  
      this.salesReportGrouped.forEach((order, index) => {
        if (index > 0) doc.addPage();
  
        // Add title
        doc.setFontSize(14);
        doc.text(`Order #: ${order.orderNumber}`, 14, 15);
  
        // Create table for the order items
        autoTable(doc, {
          startY: 25,
          head: [['Drug Name', 'Qty', 'Price/Unit', 'Total Drug Price']],
          body: order.items.map(item => [
            item.drugName,
            item.quantity.toString(),
            `₹${item.pricePerUnit.toFixed(2)}`,
            `₹${item.totalDrugPrice.toFixed(2)}`
          ]),
          didDrawPage: (data) => {
            // Add total price after each table (with null check)
            if (data.cursor) {
              doc.setFontSize(12);
              doc.text(
                `Total Order Price: ₹${order.totalOrderPrice.toFixed(2)}`, 
                14, 
                data.cursor.y + 10
              );
            }
          }
        });
  
        // Alternative position calculation if cursor is null
        if (index === 0) {
          const finalY = (doc as any).lastAutoTable?.finalY;
          if (finalY) {
            doc.setFontSize(12);
            doc.text(
              `Total Order Price: ₹${order.totalOrderPrice.toFixed(2)}`, 
              14, 
              finalY + 10
            );
          }
        }
      });
  
      doc.save('supplier_sales_report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report');
    }
  }
  
}
