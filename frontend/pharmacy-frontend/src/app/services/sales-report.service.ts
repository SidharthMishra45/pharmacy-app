// File: src/app/services/sales-report.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appConfig } from '../config/app.config';
import {
  SalesReportRequestDto,
  SalesReportResponseDto,
  SupplierSalesReportRequestDto,
  SupplierSalesReportItemDto
} from '../models/sales-report.model';

@Injectable({ providedIn: 'root' })
export class SalesReportService {
  private apiUrl = `${appConfig.apiUrl}/salesreport`;

  constructor(private http: HttpClient) {}

  getReport(request: SalesReportRequestDto): Observable<SalesReportResponseDto[]> {
    console.log('Sending report request:', request);
    return this.http.post<SalesReportResponseDto[]>(
      `${this.apiUrl}/get-sales-report`,
      request
    );
  }

  getSupplierSalesReport(
    request: SupplierSalesReportRequestDto
  ): Observable<SupplierSalesReportItemDto[]> {
    console.log('Sending supplier report request:', request);
    return this.http.post<SupplierSalesReportItemDto[]>(
      `${this.apiUrl}/get-supplier-sales-report`,
      request
    );
  }
}
