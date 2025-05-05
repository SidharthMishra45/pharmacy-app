using Pharmacy.API.DTOs.SalesReport;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pharmacy.API.Interfaces
{
    public interface ISalesReportService
    {
        Task<IEnumerable<SupplierSalesReportDto>> GetSupplierSalesReportAsync(SupplierSalesReportRequestDto requestDto);
        Task<IEnumerable<SalesReportResponseDto>> GetSalesReportAsync(SalesReportRequestDto requestDto);
    }
}
