using Pharmacy.API.Models.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;
using Pharmacy.API.Models;
public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
    Task<IEnumerable<UserDto>> GetAllSuppliersAsync();
    Task<ApplicationUser?> GetUserByIdAsync(Guid id);
    Task AddUserAsync(ApplicationUser user);
    Task<bool> UpdateUserAsync(Guid id, ApplicationUser user);
    Task<bool> DeleteUserAsync(Guid id);
}
