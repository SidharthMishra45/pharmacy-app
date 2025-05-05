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
                Description = i.Description,
                CategoryName = i.CategoryName,
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
            string normalizedDrugName = dto.DrugName.Trim().ToLower();

            Drug drug = await _context.Drugs
                .Include(d => d.Category)
                .FirstOrDefaultAsync(d => d.Name.ToLower() == normalizedDrugName);

            if (drug == null)
            {
                var category = await _context.Categories
                    .FirstOrDefaultAsync(c => c.CategoryName.ToLower() == dto.CategoryName.ToLower());

                if (category == null)
                {
                    category = new Category
                    {
                        CategoryId = Guid.NewGuid(),
                        CategoryName = dto.CategoryName
                    };
                    _context.Categories.Add(category);
                    await _context.SaveChangesAsync();
                }

                drug = new Drug
                {
                    DrugId = Guid.NewGuid(),
                    Name = dto.DrugName,
                    Description = dto.Description,
                    Price = dto.Price,
                    CategoryId = category.CategoryId
                };

                _context.Drugs.Add(drug);
                await _context.SaveChangesAsync();
            }

            var inventory = _mapper.Map<Inventory>(dto);
            inventory.InventoryId = Guid.NewGuid();
            inventory.SupplierId = supplierId;
            inventory.CategoryName = drug.Category.CategoryName;
            inventory.Description = drug.Description;
            inventory.Price = drug.Price;
            inventory.DrugName = drug.Name;

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


            // Also update the drug
            var drug = await _context.Drugs.FirstOrDefaultAsync(d => d.Name.ToLower() == inventory.DrugName.ToLower());
            if (drug != null)
            {
                drug.Description = dto.Description;
                drug.Price = dto.Price;
                _context.Drugs.Update(drug);
            }

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
