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

        Task<bool> AcceptOrderAsync(Guid orderId, Guid? supplierId);

        Task<bool> RejectOrderAsync(Guid orderId, Guid? supplierId);


        Task<IEnumerable<OrderResponseDto>> GetOrdersByStatusAsync(string status);
        
        Task<IEnumerable<OrderResponseDto>> GetAcceptedOrdersBySupplierAsync(Guid supplierId);

        Task<IEnumerable<OrderResponseDto>> GetRejectedOrdersBySupplierAsync(Guid supplierId);

        Task<bool> UpdateOrderStatusAsync(Guid orderId, string newStatus, Guid? supplierId = null);
    }
}
