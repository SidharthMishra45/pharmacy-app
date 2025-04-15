using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Pharmacy.API.Data;
using Pharmacy.API.DTOs;
using Pharmacy.API.Models;

namespace Pharmacy.API.Services
{
    public class OrderService : IOrderService
    {
        private readonly PharmacyDbContext _context;
        private readonly IMapper _mapper;

        public OrderService(PharmacyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<OrderResponseDto> PlaceOrderAsync(PlaceOrderDto orderDto, Guid doctorId)
        {
            var order = _mapper.Map<Order>(orderDto);
            order.OrderId = Guid.NewGuid();
            order.OrderDate = DateTime.UtcNow;
            order.DoctorId = doctorId;
            order.Status = "Pending";

            // Generate OrderItemIds and assign OrderId
            foreach (var item in order.OrderItems)
            {
                item.OrderItemId = Guid.NewGuid();
                item.OrderId = order.OrderId;
            }

            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();

            // Include drug info in response
            var createdOrder = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Drug)
                .FirstOrDefaultAsync(o => o.OrderId == order.OrderId);

            return _mapper.Map<OrderResponseDto>(createdOrder);
        }

        public async Task<IEnumerable<OrderResponseDto>> GetAllOrdersAsync()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Drug)
                .Include(o => o.Doctor)
                .ToListAsync();

            var result = _mapper.Map<IEnumerable<OrderResponseDto>>(orders);
            return result;
        }

        public async Task<IEnumerable<OrderResponseDto>> GetOrdersByDoctorIdAsync(Guid doctorId)
        {
            var orders = await _context.Orders
                .Where(o => o.DoctorId == doctorId)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Drug)
                .ToListAsync();

            return _mapper.Map<IEnumerable<OrderResponseDto>>(orders);
        }

        public async Task<OrderResponseDto?> GetOrderByIdAsync(Guid orderId, Guid doctorId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Drug)
                .FirstOrDefaultAsync(o => o.OrderId == orderId && o.DoctorId == doctorId);

            return order == null ? null : _mapper.Map<OrderResponseDto>(order);
        }

        public async Task<IEnumerable<OrderResponseDto>> GetOrdersByStatusAsync(string status)
        {
            var orders = await _context.Orders
                .Where(o => o.Status == status)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Drug)
                .Include(o => o.Doctor)
                .ToListAsync();

            return _mapper.Map<IEnumerable<OrderResponseDto>>(orders);
        }

        public async Task<bool> UpdateOrderStatusAsync(Guid orderId, string newStatus)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
                return false;

            order.Status = newStatus;

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return true;
        }

        
    }
}
