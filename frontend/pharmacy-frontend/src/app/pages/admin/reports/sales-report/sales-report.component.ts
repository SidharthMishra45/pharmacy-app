import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesReportService } from '../../../../services/sales-report.service';
import { SalesReportItem, SalesReportRequestDto } from '../../../../models/sales-report.model';
import { AuthService } from '../../../../services/auth.service';
import { RouterModule } from '@angular/router';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable'

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss']
})
export class SalesReportComponent {
  supplierId = '';
  fromDate = '';
  toDate = '';
  salesReport: SalesReportItem[] = [];
  isLoading = false;
  suppliers: { id: string, name: string }[] = [];
  minDate: string = ''; // Add the minDate property

  constructor(
    private salesReportService: SalesReportService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.authService.getAllSuppliers().subscribe({
      next: (res) => {
        this.suppliers = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Failed to fetch suppliers.');
      },
    });

    // Set the minDate property to today's date
    const earliestDate = new Date(2000, 0, 1); // Month is 0-indexed
    this.minDate = earliestDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
  }

  // Load all suppliers
  loadSuppliers(): void {
    this.authService.getAllSuppliers().subscribe({
      next: (res) => {
        console.log('Raw supplier response:', res);
        this.suppliers = res;
      },
      error: (err) => {
        console.error('Error fetching suppliers:', err);
        alert('Failed to fetch suppliers.');
        this.isLoading = false;
      },
      complete: () => {
        console.log('Finished fetching suppliers.');
      }
    });
    
  }

  // Fetch the sales report based on selected supplier and date range
  fetchReport(): void {
    if (!this.supplierId || !this.fromDate || !this.toDate) {
      alert('Please fill in all fields.');
      return;
    }

    this.isLoading = true;
    const request: SalesReportRequestDto = {
      supplierId: this.supplierId,
      fromDate: this.fromDate,
      toDate: this.toDate
    };

    console.log('Current supplierId:', this.supplierId);
    console.log('Type of supplierId:', typeof this.supplierId);

    this.salesReportService.getReport(request).subscribe({
      next: (res) => {
        this.salesReport = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Failed to fetch report.');
      }
    });
  }

  // Download the report as PDF
  downloadReport(): void {
    const request: SalesReportRequestDto = {
      supplierId: this.supplierId,
      fromDate: this.fromDate,
      toDate: this.toDate
    };

    this.salesReportService.getReport(request).subscribe({
      next: (res) => {
        this.salesReport = res;
        this.generatePdf();
      },
      error: () => {
        alert('Failed to fetch sales report.');
      },
    });
  }

  generatePdf(): void {
    const doc = new jsPDF();

    const tableData = this.salesReport.map(item => [
      item.drugNames.join(', '), // Assuming 'drugNames' is an array
      item.quantity,
      item.price,
      item.supplierName,
    ]);

    autoTable(doc,{
      head: [['Drug Names', 'Quantity', 'Price', 'Supplier']],
      body: tableData,
    });

    doc.save('sales_report.pdf');
  }
}
