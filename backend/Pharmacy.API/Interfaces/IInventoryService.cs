using Pharmacy.API.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pharmacy.API.Services
{
    public interface IInventoryService
    {
        Task<IEnumerable<InventoryReadDto>> GetInventoriesAsync(Guid supplierId);
        Task<InventoryReadDto> GetInventoryByIdAsync(Guid inventoryId, Guid supplierId);
        Task<InventoryReadDto> CreateInventoryAsync(Guid supplierId, InventoryCreateDto dto);
        Task<bool> UpdateInventoryAsync(Guid supplierId, InventoryUpdateDto dto);
        Task<bool> DeleteInventoryAsync(Guid inventoryId, Guid supplierId);

        Task<IEnumerable<InventoryReadDto>> GetAllInventoriesForAdminAsync();

    }
}
