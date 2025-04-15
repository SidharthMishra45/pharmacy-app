using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pharmacy.API.DTOs;
using Pharmacy.API.Services;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Pharmacy.API.Models;
namespace Pharmacy.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = UserRoles.Doctor)]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        // POST: api/Order
        [HttpPost]
        public async Task<ActionResult<OrderResponseDto>> PlaceOrder([FromBody] PlaceOrderDto orderDto)
        {
            var doctorId = GetLoggedInUserId();
            var order = await _orderService.PlaceOrderAsync(orderDto, doctorId);
            return CreatedAtAction(nameof(GetOrderById), new { orderId = order.OrderId }, order);
        }

        // GET: api/order
        [HttpGet]
        [Authorize(Roles = $"{UserRoles.Supplier}, {UserRoles.Admin}")]
        public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetAllOrders()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(orders);
        }


        // GET: api/Order
        [HttpGet("my-orders")]
        public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetMyOrders()
        {
            var doctorId = GetLoggedInUserId();
            var orders = await _orderService.GetOrdersByDoctorIdAsync(doctorId);
            return Ok(orders);
        }

        // GET: api/Order/{orderId}
        [HttpGet("{orderId}")]
        public async Task<ActionResult<OrderResponseDto>> GetOrderById(Guid orderId)
        {
            var doctorId = GetLoggedInUserId();
            var order = await _orderService.GetOrderByIdAsync(orderId, doctorId);

            if (order == null)
                return NotFound("Order not found.");

            return Ok(order);
        }

        [HttpPut("{orderId}/status")]
        [Authorize(Roles = UserRoles.Supplier)]
        public async Task<IActionResult> UpdateOrderStatus(Guid orderId, [FromQuery] string status)
        {
            var success = await _orderService.UpdateOrderStatusAsync(orderId, status);
            if (!success)
                return NotFound("Order not found or could not update.");

            return NoContent();
        }


        // GET: api/order/status?status=Pending
        [HttpGet("status")]
        [Authorize(Roles = UserRoles.Supplier)]
        public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetOrdersByStatus([FromQuery] string status)
        {
            var orders = await _orderService.GetOrdersByStatusAsync(status);
            return Ok(orders);
        }


        

        // Utility to extract the logged-in user's Guid ID from JWT token
        private Guid GetLoggedInUserId()
        {
            var userIdString = User.FindFirst("UserGuid")?.Value;

            if (userIdString == null)
                throw new InvalidOperationException("UserGuid claim is missing.");

            if (!Guid.TryParse(userIdString, out var userId))
                throw new InvalidOperationException("Invalid GUID format for User ID.");

            return userId;
        }
    }
}
