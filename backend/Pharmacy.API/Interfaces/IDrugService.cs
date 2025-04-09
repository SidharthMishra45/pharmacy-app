using Pharmacy.API.Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pharmacy.API.Services
{
    public interface IDrugService
    {
        Task<IEnumerable<DrugDto>> GetAllDrugsAsync();
        Task<PagedResult<DrugDto>> GetFilteredDrugsAsync(
            string searchTerm,
            int page = 1,
            int pageSize = 10,
            string sortBy = "Name",
            bool ascending = true,
            Guid? categoryId = null
        );
        Task<DrugDto> GetDrugByIdAsync(Guid id);
        Task<DrugDto> AddDrugAsync(DrugDto drugDto);
        Task<bool> UpdateDrugAsync(Guid id, DrugDto drugDto);
        Task<bool> DeleteDrugAsync(Guid id);
    }
}
