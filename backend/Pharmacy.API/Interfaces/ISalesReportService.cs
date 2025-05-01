using Pharmacy.API.DTOs.SalesReport;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pharmacy.API.Interfaces
{
    public interface ISalesReportService
    {
        Task<IEnumerable<SalesReportResponseDto>> GetSalesReportAsync(SalesReportRequestDto requestDto);
    }
}
