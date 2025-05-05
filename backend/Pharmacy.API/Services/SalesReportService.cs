using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Pharmacy.API.Data;
using Pharmacy.API.DTOs.SalesReport;
using Pharmacy.API.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pharmacy.API.Services
{
    public class SalesReportService : ISalesReportService
    {
        private readonly PharmacyDbContext _context;
        private readonly IMapper _mapper;

        public SalesReportService(PharmacyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<SupplierSalesReportDto>> GetSupplierSalesReportAsync(SupplierSalesReportRequestDto requestDto)
        {
            var query = _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Drug)
                .Where(o => o.Status == "Accepted" && o.SupplierId == requestDto.SupplierId)
                .AsQueryable();

            if (requestDto.FromDate.HasValue)
            {
                query = query.Where(o => o.OrderDate >= requestDto.FromDate.Value);
            }

            if (requestDto.ToDate.HasValue)
            {
                query = query.Where(o => o.OrderDate <= requestDto.ToDate.Value);
            }

            var orders = await query.ToListAsync();

            var reportItems = orders.SelectMany(order =>
                order.OrderItems.Select(item => new SupplierSalesReportDto
                {
                    OrderId = order.OrderId.ToString(),
                    DrugName = item.Drug.Name,
                    Quantity = item.Quantity,
                    PricePerUnit = item.Drug.Price,
                    TotalDrugPrice = item.Quantity * item.Drug.Price,
                    TotalOrderPrice = order.OrderItems.Sum(oi => oi.Quantity * oi.Drug.Price)
                })).ToList();

            return reportItems;
        }


        public async Task<IEnumerable<SalesReportResponseDto>> GetSalesReportAsync(SalesReportRequestDto requestDto)
        {
            var query = _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Drug)
                .Where(o => o.Status == "Accepted")
                .AsQueryable();

            if (requestDto.SupplierId != null)
            {
                query = query.Where(o => o.SupplierId == requestDto.SupplierId);
            }

            if (requestDto.FromDate.HasValue)
            {
                query = query.Where(o => o.OrderDate >= requestDto.FromDate.Value);
            }

            if (requestDto.ToDate.HasValue)
            {
                query = query.Where(o => o.OrderDate <= requestDto.ToDate.Value);
            }

            var orders = await query.ToListAsync();

            var grouped = orders
                .GroupBy(o => o.OrderDate.Date)
                .Select(g => new SalesReportResponseDto
                {
                    Date = g.Key,
                    TotalOrders = g.Count(),
                    TotalRevenue = g.Sum(o => o.OrderItems.Sum(oi => oi.Drug.Price * oi.Quantity))
                })
                .OrderBy(r => r.Date)
                .ToList();

            return grouped;
        }
    }
}
