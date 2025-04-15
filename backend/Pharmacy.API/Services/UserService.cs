// File: Services/UserService.cs
using Pharmacy.API.Models;
using Pharmacy.API.Models.Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Pharmacy.API.Data; // Assuming your DbContext is in this namespace

namespace Pharmacy.API.Services
{
   

    public class UserService : IUserService
    {
        private readonly PharmacyDbContext _context;

        public UserService(PharmacyDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            return await _context.Users
                .Select(user => new UserDto
                {
                    UserId = user.Id,
                    Email = user.Email,
                    Name = user.Name, // ApplicationUser.Name
                    Role = user.Role
                })
                .ToListAsync();
        }


        public async Task<ApplicationUser?> GetUserByIdAsync(Guid id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task AddUserAsync(ApplicationUser user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> UpdateUserAsync(Guid id, ApplicationUser user)
        {
            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null) return false;

            existingUser.Email = user.Email;
            existingUser.Name = user.Name;
            existingUser.Role = user.Role;

            _context.Users.Update(existingUser);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteUserAsync(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
