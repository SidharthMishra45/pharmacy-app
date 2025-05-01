import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appConfig } from '../config/app.config';
import { SalesReportItem, SalesReportRequestDto } from '../models/sales-report.model';

@Injectable({ providedIn: 'root' })
export class SalesReportService {
  private apiUrl = `${appConfig.apiUrl}/salesreport`;

  constructor(private http: HttpClient) {}

  getReport(request: SalesReportRequestDto): Observable<SalesReportItem[]> {
    let params = new HttpParams()
    if (request.supplierId && request.supplierId !== 'undefined') {
      params = params.set('supplierId', request.supplierId);
    }
  
    if (request.fromDate) {
      params = params.set('fromDate', request.fromDate);
    }
  
    if (request.toDate) {
      params = params.set('toDate', request.toDate);
    }
    console.log('Sending sales report request:', request);

    return this.http.get<SalesReportItem[]>(this.apiUrl, { params });
  }
}
