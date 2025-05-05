namespace Pharmacy.API.DTOs.SalesReport
{
    public class SupplierSalesReportRequestDto
    {
        public Guid SupplierId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

}
