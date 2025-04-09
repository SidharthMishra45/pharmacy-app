// Services/ICategoryService.cs
using Pharmacy.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface ICategoryService
{
    Task<IEnumerable<Category>> GetAllCategoriesAsync();
}
