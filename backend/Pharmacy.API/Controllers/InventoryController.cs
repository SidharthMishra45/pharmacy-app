using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pharmacy.API.DTOs;
using Pharmacy.API.Models;
using Pharmacy.API.Services;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Pharmacy.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;

        public InventoryController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        [HttpGet("all")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<ActionResult<IEnumerable<InventoryReadDto>>> GetAllInventories()
        {
            var inventories = await _inventoryService.GetAllInventoriesForAdminAsync();
            return Ok(inventories);
        }


        // GET: api/Inventory
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InventoryReadDto>>> GetMyInventory()
        {
            var supplierId = GetLoggedInUserId();
            var inventories = await _inventoryService.GetInventoriesAsync(supplierId);
            return Ok(inventories);
        }

        // GET: api/Inventory/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<InventoryReadDto>> GetInventory(Guid id)
        {
            var supplierId = GetLoggedInUserId();
            var inventory = await _inventoryService.GetInventoryByIdAsync(id, supplierId);

            if (inventory == null)
                return NotFound("Inventory item not found.");

            return Ok(inventory);
        }

        // POST: api/Inventory
        [HttpPost]
        public async Task<ActionResult<InventoryReadDto>> CreateInventory([FromBody] InventoryCreateDto dto)
        {
            var supplierId = GetLoggedInUserId();
            var createdInventory = await _inventoryService.CreateInventoryAsync(supplierId, dto);

            return CreatedAtAction(nameof(GetInventory), new { id = createdInventory.InventoryId }, createdInventory);
        }

        // PUT: api/Inventory/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInventory(Guid id, [FromBody] InventoryUpdateDto dto)
        {
            if (id != dto.InventoryId)
                return BadRequest("ID mismatch.");

            var supplierId = GetLoggedInUserId();
            var success = await _inventoryService.UpdateInventoryAsync(supplierId, dto);

            if (!success)
                return NotFound("Inventory not found.");

            return NoContent();
        }

        // DELETE: api/Inventory/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInventory(Guid id)
        {
            var supplierId = GetLoggedInUserId();
            var success = await _inventoryService.DeleteInventoryAsync(id, supplierId);

            if (!success)
                return NotFound("Inventory not found.");

            return NoContent();
        }

        private Guid GetLoggedInUserId()
        {
            Console.WriteLine("All claims:");
            foreach (var claim in User.Claims)
            {
                Console.WriteLine($"{claim.Type}: {claim.Value}");
            }

            var userIdString = User.FindFirst("UserGuid")?.Value;
            if (userIdString == null)
            {
                throw new InvalidOperationException("UserGuid claim is missing.");
            }
            Console.WriteLine($"Extracted UserGuid: {userIdString}");

            if (!Guid.TryParse(userIdString, out var userId))
            {
                throw new InvalidOperationException("Invalid GUID format for User ID.");
            }
            return userId;

        }

    }
}
