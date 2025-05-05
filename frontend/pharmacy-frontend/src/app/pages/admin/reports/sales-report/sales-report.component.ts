import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule   } from '@angular/forms';
import { RouterModule  } from '@angular/router';
import { jsPDF         } from 'jspdf';
import { autoTable     } from 'jspdf-autotable';

import { SalesReportService } from '../../../../services/sales-report.service';
import { AuthService        } from '../../../../services/auth.service';
import {
  SalesReportRequestDto,
  SalesReportResponseDto
} from '../../../../models/sales-report.model';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss']
})
export class SalesReportComponent implements OnInit {
  supplierId = '';
  fromDate   = '';
  toDate     = '';
  salesReport: SalesReportResponseDto[] = [];
  isLoading  = false;
  suppliers: { userId: string; name: string }[] = [];
  minDate    = '';

  constructor(
    private salesReportService: SalesReportService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.authService.getAllSuppliers().subscribe({
      next: res => {
        this.suppliers  = res;
        this.isLoading  = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Failed to fetch suppliers.');
      }
    });

    // allow dates back to Jan 1, 2000
    this.minDate = new Date(2000, 0, 1)
      .toISOString().split('T')[0];
  }

  fetchReport(): void {
    if (!this.supplierId || !this.fromDate || !this.toDate) {
      alert('Please fill in all fields.');
      return;
    }

    this.isLoading = true;
    const req: SalesReportRequestDto = {
      supplierId: this.supplierId,
      fromDate:   this.fromDate,
      toDate:     this.toDate
    };

    this.salesReportService.getReport(req).subscribe({
      next: data => {
        this.salesReport = data;
        this.isLoading   = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Failed to fetch report.');
      }
    });
  }

  downloadReport(): void {
    const doc = new jsPDF();

    const tableData = this.salesReport.map(r => [
      new Date(r.date).toLocaleDateString(),
      r.totalOrders,
      r.totalRevenue
    ]);

    autoTable(doc, {
      head: [['Date', 'Total Orders', 'Total Revenue']],
      body: tableData
    });

    doc.save('sales_report.pdf');
  }
}
