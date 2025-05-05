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

        // Admin only: Get all inventories across suppliers
        [HttpGet("all")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<ActionResult<IEnumerable<InventoryReadDto>>> GetAllInventories()
        {
            var inventories = await _inventoryService.GetAllInventoriesForAdminAsync();
            return Ok(inventories);
        }

        // Supplier: Get own inventory
        [HttpGet]
        [Authorize(Roles = UserRoles.Supplier)]
        public async Task<ActionResult<IEnumerable<InventoryReadDto>>> GetMyInventory()
        {
            var supplierId = GetLoggedInUserId();
            var inventories = await _inventoryService.GetInventoriesAsync(supplierId);
            return Ok(inventories);
        }

        // Supplier: Get specific inventory by ID
        [HttpGet("{id}")]
        [Authorize(Roles = UserRoles.Supplier)]
        public async Task<ActionResult<InventoryReadDto>> GetInventory(Guid id)
        {
            var supplierId = GetLoggedInUserId();
            var inventory = await _inventoryService.GetInventoryByIdAsync(id, supplierId);

            if (inventory == null)
                return NotFound("Inventory item not found.");

            return Ok(inventory);
        }

        // Supplier: Create new inventory
        [HttpPost]
        [Authorize(Roles = UserRoles.Supplier)]
        public async Task<ActionResult<InventoryReadDto>> CreateInventory([FromBody] InventoryCreateDto dto)
        {
            var supplierId = GetLoggedInUserId();
            var createdInventory = await _inventoryService.CreateInventoryAsync(supplierId, dto);

            return CreatedAtAction(nameof(GetInventory), new { id = createdInventory.InventoryId }, createdInventory);
        }

        // Supplier: Update existing inventory
        [HttpPut("{id}")]
        [Authorize(Roles = UserRoles.Supplier)]
        public async Task<IActionResult> UpdateInventory(Guid id, [FromBody] InventoryUpdateDto dto)
        {
            if (id != dto.InventoryId)
                return BadRequest("Inventory ID mismatch.");

            var supplierId = GetLoggedInUserId();
            var success = await _inventoryService.UpdateInventoryAsync(supplierId, dto);

            if (!success)
                return NotFound("Inventory item not found or unauthorized.");

            return NoContent();
        }

        // Supplier: Delete inventory
        [HttpDelete("{id}")]
        [Authorize(Roles = UserRoles.Supplier)]
        public async Task<IActionResult> DeleteInventory(Guid id)
        {
            var supplierId = GetLoggedInUserId();
            var success = await _inventoryService.DeleteInventoryAsync(id, supplierId);

            if (!success)
                return NotFound("Inventory item not found or unauthorized.");

            return NoContent();
        }

        // Helper method to extract logged-in user's GUID
        private Guid GetLoggedInUserId()
        {
            var userIdString = User.FindFirst("UserGuid")?.Value;
            if (string.IsNullOrEmpty(userIdString))
                throw new UnauthorizedAccessException("UserGuid claim is missing.");

            if (!Guid.TryParse(userIdString, out var userId))
                throw new UnauthorizedAccessException("Invalid GUID format for User ID.");

            return userId;
        }
    }
}
