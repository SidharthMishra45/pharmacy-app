using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pharmacy.API.Models;
using Pharmacy.API.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;


namespace Pharmacy.API.Controllers
{
    [Route("api/orders")]
    [ApiController]
    [Authorize(Policy = "DoctorOnly")] 
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<IActionResult> PlaceOrder([FromBody] Order order)
        {
            var doctorId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            await _orderService.PlaceOrderAsync(order, doctorId);
            return CreatedAtAction(nameof(GetOrders), new { id = order.OrderId }, order);
        }


        [Authorize(Policy = "CanManageDrugs")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(orders);
        }

        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var doctorId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var orders = await _orderService.GetOrdersByDoctorAsync(doctorId);
            return Ok(orders);
        }
    }
}
