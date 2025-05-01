using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Pharmacy.API.Data;
using Pharmacy.API.DTOs;
using Pharmacy.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pharmacy.API.Services
{
    public class InventoryService : IInventoryService
    {
        private readonly PharmacyDbContext _context;
        private readonly IMapper _mapper;

        public InventoryService(PharmacyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<InventoryReadDto>> GetAllInventoriesForAdminAsync()
        {
            var inventories = await _context.Inventories
                .Include(i => i.Supplier) // assuming Inventory has a navigation property `Supplier`
                .ToListAsync();

            var inventoryDtos = inventories.Select(i => new InventoryReadDto
            {
                InventoryId = i.InventoryId,
                DrugName = i.DrugName,
                Quantity = i.Quantity,
                Price = i.Price,
                ExpiryDate = i.ExpiryDate,
                SupplierId = i.SupplierId,
                SupplierName = i.Supplier != null ? i.Supplier.Name : "Unknown"
            });

            return inventoryDtos;
        }

        public async Task<IEnumerable<InventoryReadDto>> GetInventoriesAsync(Guid supplierId)
        {
            var inventories = await _context.Inventories
                .Where(i => i.SupplierId == supplierId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<InventoryReadDto>>(inventories);
        }

        public async Task<InventoryReadDto> GetInventoryByIdAsync(Guid inventoryId, Guid supplierId)
        {
            var inventory = await _context.Inventories
                .FirstOrDefaultAsync(i => i.InventoryId == inventoryId && i.SupplierId == supplierId);

            return inventory != null ? _mapper.Map<InventoryReadDto>(inventory) : null;
        }

        public async Task<InventoryReadDto> CreateInventoryAsync(Guid supplierId, InventoryCreateDto dto)
        {
            var inventory = _mapper.Map<Inventory>(dto);
            inventory.InventoryId = Guid.NewGuid();
            inventory.SupplierId = supplierId;

            await _context.Inventories.AddAsync(inventory);
            await _context.SaveChangesAsync();

            return _mapper.Map<InventoryReadDto>(inventory);
        }

        public async Task<bool> UpdateInventoryAsync(Guid supplierId, InventoryUpdateDto dto)
        {
            var inventory = await _context.Inventories
                .FirstOrDefaultAsync(i => i.InventoryId == dto.InventoryId && i.SupplierId == supplierId);

            if (inventory == null)
                return false;

            _mapper.Map(dto, inventory);
            _context.Inventories.Update(inventory);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteInventoryAsync(Guid inventoryId, Guid supplierId)
        {
            var inventory = await _context.Inventories
                .FirstOrDefaultAsync(i => i.InventoryId == inventoryId && i.SupplierId == supplierId);

            if (inventory == null)
                return false;

            _context.Inventories.Remove(inventory);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
