using Pharmacy.API.Models;
using Pharmacy.API.DTOs;

namespace Pharmacy.API.Services
{
    public interface IOrderService
    {
        Task<OrderResponseDto> PlaceOrderAsync(PlaceOrderDto orderDto, Guid doctorId);
        Task<IEnumerable<OrderResponseDto>> GetAllOrdersAsync();
        Task<IEnumerable<OrderResponseDto>> GetOrdersByDoctorIdAsync(Guid doctorId);
        Task<OrderResponseDto?> GetOrderByIdAsync(Guid orderId, Guid doctorId);

        Task<IEnumerable<OrderResponseDto>> GetOrdersByStatusAsync(string status);

        Task<bool> UpdateOrderStatusAsync(Guid orderId, string newStatus);

    }
}
