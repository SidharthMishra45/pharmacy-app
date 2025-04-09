using Microsoft.EntityFrameworkCore;
using Pharmacy.API.Data;
using Pharmacy.API.Dtos;
using Pharmacy.API.Models;
using Pharmacy.API.Services; // Use this if IDrugService is in Services. Adjust if it's in Interfaces.
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pharmacy.API.Services
{
    public class DrugService : IDrugService
    {
        private readonly PharmacyDbContext _context;

        public DrugService(PharmacyDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DrugDto>> GetAllDrugsAsync()
        {
            var drugs = await _context.Drugs.Include(d => d.Category).ToListAsync();
            return drugs.Select(MapToDto);
        }

        public async Task<PagedResult<DrugDto>> GetFilteredDrugsAsync(
            string searchTerm,
            int page = 1,
            int pageSize = 10,
            string sortBy = "Name",
            bool ascending = true,
            Guid? categoryId = null)
        {
            var query = _context.Drugs.Include(d => d.Category).AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(d =>
                    EF.Functions.Like(d.Name, $"%{searchTerm}%") ||
                    (d.Description != null && EF.Functions.Like(d.Description, $"%{searchTerm}%")));
            }

            if (categoryId.HasValue)
            {
                query = query.Where(d => d.CategoryId == categoryId.Value);
            }

            var totalCount = await query.CountAsync();

            query = sortBy switch
            {
                "Price" => ascending ? query.OrderBy(d => d.Price) : query.OrderByDescending(d => d.Price),
                _ => ascending ? query.OrderBy(d => d.Name) : query.OrderByDescending(d => d.Name),
            };

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<DrugDto>
            {
                Items = items.Select(MapToDto),
                TotalCount = totalCount
            };
        }

        public async Task<DrugDto> GetDrugByIdAsync(Guid id)
        {
            var drug = await _context.Drugs.Include(d => d.Category).FirstOrDefaultAsync(d => d.DrugId == id);
            return drug == null ? null : MapToDto(drug);
        }

        public async Task<DrugDto> AddDrugAsync(DrugDto drugDto)
        {
            var drug = new Drug
            {
                DrugId = Guid.NewGuid(),
                Name = drugDto.Name,
                Description = drugDto.Description,
                Price = drugDto.Price,
                CategoryId = drugDto.CategoryId
            };

            _context.Drugs.Add(drug);
            await _context.SaveChangesAsync();

            drugDto.DrugId = drug.DrugId;
            return drugDto;
        }

        public async Task<bool> UpdateDrugAsync(Guid id, DrugDto drugDto)
        {
            var existingDrug = await _context.Drugs.FindAsync(id);
            if (existingDrug == null) return false;

            existingDrug.Name = drugDto.Name;
            existingDrug.Description = drugDto.Description;
            existingDrug.Price = drugDto.Price;
            existingDrug.CategoryId = drugDto.CategoryId;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteDrugAsync(Guid id)
        {
            var drug = await _context.Drugs.FindAsync(id);
            if (drug == null) return false;

            _context.Drugs.Remove(drug);
            await _context.SaveChangesAsync();
            return true;
        }

        private DrugDto MapToDto(Drug drug)
        {
            return new DrugDto
            {
                DrugId = drug.DrugId,
                Name = drug.Name,
                Description = drug.Description,
                Price = drug.Price,
                CategoryId = drug.CategoryId,
                CategoryName = drug.Category?.CategoryName
            };
        }
    }
}
