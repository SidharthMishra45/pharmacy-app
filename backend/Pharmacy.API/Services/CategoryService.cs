// Services/CategoryService.cs
using Pharmacy.API.Models;
using Pharmacy.API.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

public class CategoryService : ICategoryService
{
    private readonly PharmacyDbContext _context;

    public CategoryService(PharmacyDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
    {
        return await _context.Categories.ToListAsync();
    }
}
