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
            order.SupplierId = null;

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

        public async Task<bool> AcceptOrderAsync(Guid orderId, Guid? supplierId = null)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Drug)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

                if (order == null)
                {
                    Console.WriteLine($"Order not found: {orderId}");
                    return false;
                }

                if (order.Status != "Pending")
                {
                    Console.WriteLine($"Order is not pending. Status: {order.Status}");
                    return false;
                }

            // Check if enough inventory exists for each drug
            foreach (var item in order.OrderItems)
            {
                var inventory = await _context.Inventories.FirstOrDefaultAsync(i =>
                    i.DrugName.ToLower() == item.Drug.Name.ToLower() &&
                    i.SupplierId == supplierId);

                if (inventory == null)
                {
                    Console.WriteLine($"No inventory found for drug: {item.Drug.Name}, Supplier: {supplierId}");
                    return false;
                }

                if (inventory.Quantity < item.Quantity)
                {
                    Console.WriteLine($"Insufficient inventory for {item.Drug.Name}. Available: {inventory.Quantity}, Required: {item.Quantity}");
                    return false;
                }

                // Deduct inventory quantity
                inventory.Quantity -= item.Quantity;
                _context.Inventories.Update(inventory);
            }

            // Assign the supplier and update order status
            order.SupplierId = supplierId;
            order.Status = "Accepted";

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> RejectOrderAsync(Guid orderId, Guid? supplierId = null)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Drug)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

                if (order == null)
                {
                    Console.WriteLine($"Order not found: {orderId}");
                    return false;
                }

                if (order.Status != "Pending")
                {
                    Console.WriteLine($"Order is not pending. Status: {order.Status}");
                    return false;
                }

            // Assign the supplier and update order status
            order.SupplierId = supplierId;
            order.Status = "Rejected";

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return true;
        }



        public async Task<bool> UpdateOrderStatusAsync(Guid orderId, string newStatus, Guid? supplierId = null)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
                return false;

            // Update order status
            order.Status = newStatus;

            // If the status is 'Accepted' and supplierId is provided, update the SupplierId
            if (newStatus == "Accepted" && supplierId.HasValue)
            {
                order.SupplierId = supplierId.Value;
            }

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return true;
        }


        public async Task<IEnumerable<OrderResponseDto>> GetAcceptedOrdersBySupplierAsync(Guid supplierId)
        {
            var orders = await _context.Orders
                .Where(o => o.Status == "Accepted" && o.SupplierId == supplierId)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Drug)
                .Include(o => o.Doctor)
                .ToListAsync();

            return _mapper.Map<IEnumerable<OrderResponseDto>>(orders);
        }

        public async Task<IEnumerable<OrderResponseDto>> GetRejectedOrdersBySupplierAsync(Guid supplierId)
        {
            var orders = await _context.Orders
                .Where(o => o.Status == "Rejected" && o.SupplierId == supplierId)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Drug)
                .Include(o => o.Doctor)
                .ToListAsync();

            return _mapper.Map<IEnumerable<OrderResponseDto>>(orders);
        }

    }
}
