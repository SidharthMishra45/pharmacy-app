using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pharmacy.API.DTOs.SalesReport;
using Pharmacy.API.Interfaces;
using System;
using System.Threading.Tasks;

namespace Pharmacy.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SalesReportController : ControllerBase
    {
        private readonly ISalesReportService _salesReportService;

        public SalesReportController(ISalesReportService salesReportService)
        {
            _salesReportService = salesReportService;
        }

        // POST: api/SalesReport/get-supplier-sales-report
        [HttpPost("get-supplier-sales-report")]
        [Authorize(Roles = "Supplier")]
        public async Task<IActionResult> GetSupplierSalesReport([FromBody] SupplierSalesReportRequestDto req)
        {
            Console.WriteLine(
                $"[POST] SUPPLIER REPORT: SupplierId={req.SupplierId}, From={req.FromDate}, To={req.ToDate}"
            );

            var report = await _salesReportService.GetSupplierSalesReportAsync(req);
            return Ok(report);
        }



        // POST: api/SalesReport?supplierId={}&fromDate={}&toDate={}
        [HttpPost("get-sales-report")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetSalesReport([FromBody] SalesReportRequestDto req)
        {
            Console.WriteLine(
               $"[POST] SupplierId={req.SupplierId}, From={req.FromDate}, To={req.ToDate}"
            );

            var data = await _salesReportService.GetSalesReportAsync(req);
            return Ok(data);
        }
    }
}
