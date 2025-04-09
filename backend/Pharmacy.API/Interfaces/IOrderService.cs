using Pharmacy.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pharmacy.API.Services
{
    public interface IOrderService
    {
        Task<IEnumerable<Order>> GetAllOrdersAsync();
        Task PlaceOrderAsync(Order order, Guid doctorId);
        Task<IEnumerable<Order>> GetOrdersByDoctorAsync(Guid doctorId);

    }
}
