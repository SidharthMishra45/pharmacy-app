using Pharmacy.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
    Task<ApplicationUser?> GetUserByIdAsync(Guid id);
    Task AddUserAsync(ApplicationUser user);
    Task<bool> UpdateUserAsync(Guid id, ApplicationUser user);
    Task<bool> DeleteUserAsync(Guid id);
}
