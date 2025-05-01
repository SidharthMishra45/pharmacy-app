using System;

namespace Pharmacy.API.DTOs.SalesReport
{
    public class SalesReportResponseDto
    {
        public DateTime Date { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalRevenue { get; set; }
    }
}
