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

        // GET: api/SalesReport?supplierId={}&fromDate={}&toDate={}
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetSalesReport([FromQuery] SalesReportRequestDto requestDto)
        {
            try
            {
                Console.WriteLine($"[GET /salesreport] SupplierId={requestDto.SupplierId}, FromDate={requestDto.FromDate}, ToDate={requestDto.ToDate}");

                var report = await _salesReportService.GetSalesReportAsync(requestDto);
                return Ok(report);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Failed to get sales report: {ex.Message}");

                return BadRequest(new { message = "Failed to generate sales report.", error = ex.Message });
            }
        }
    }
}
