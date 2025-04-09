using Microsoft.EntityFrameworkCore;
using Pharmacy.API.Data;
using Pharmacy.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pharmacy.API.Services
{
    public class OrderService : IOrderService
    {
        private readonly PharmacyDbContext _context;

        public OrderService(PharmacyDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Order>> GetAllOrdersAsync()
        {        
            return await _context.Orders
                .Include(o => o.Doctor)
                .Include(o => o.TransactionDetail)
                .ToListAsync();
        }

        public async Task PlaceOrderAsync(Order order, Guid doctorId)
        {
            order.DoctorId = doctorId;
            order.OrderId = Guid.NewGuid(); // Ensure a new Guid is assigned
            order.OrderDate = DateTime.UtcNow; // Set order date
            order.Status = "Pending"; // Default status

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Order>> GetOrdersByDoctorAsync(Guid doctorId)
        {
            return await _context.Orders
                .Include(o => o.TransactionDetail)
                .Where(o => o.DoctorId == doctorId)
                .ToListAsync();
        }

    }
}
