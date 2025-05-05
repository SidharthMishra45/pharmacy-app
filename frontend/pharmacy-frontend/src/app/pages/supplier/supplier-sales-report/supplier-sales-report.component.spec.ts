import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierSalesReportComponent } from './supplier-sales-report.component';

describe('SupplierSalesReportComponent', () => {
  let component: SupplierSalesReportComponent;
  let fixture: ComponentFixture<SupplierSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierSalesReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
