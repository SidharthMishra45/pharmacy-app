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
    public async Task<Category> CreateCategoryAsync(Category category)
    {
        category.CategoryId = Guid.NewGuid();
        category.CategoryName = category.CategoryName.Trim();
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task<bool> UpdateCategoryAsync(Guid id, Category category)
    {
        var existingCategory = await _context.Categories.FindAsync(id);
        if (existingCategory == null) return false;

        existingCategory.CategoryName = category.CategoryName.Trim();

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteCategoryAsync(Guid id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return false;

         _context.Categories.Remove(category);
         await _context.SaveChangesAsync();
        return true;
    }
}
