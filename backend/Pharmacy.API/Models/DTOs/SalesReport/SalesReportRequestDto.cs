using System;

namespace Pharmacy.API.DTOs.SalesReport
{
    public class SalesReportRequestDto
    {
        public Guid? SupplierId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}
