using Microsoft.AspNetCore.Mvc;
using Pharmacy.API.Models;
using Pharmacy.API.Models.Dtos;
using Pharmacy.API.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pharmacy.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("getsuppliers")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllSuppliers()
        {
            var suppliers = await _userService.GetAllSuppliersAsync(); // Implement this service method if needed
            return Ok(suppliers);
        }


        // GET: api/Users/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ApplicationUser>> GetUserById(Guid id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult> AddUser([FromBody] ApplicationUser user)
        {
            await _userService.AddUserAsync(user);
            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
        }

        // PUT: api/Users/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUser(Guid id, [FromBody] ApplicationUser user)
        {
            var updated = await _userService.UpdateUserAsync(id, user);
            if (!updated) return NotFound();
            return NoContent();
        }

        // DELETE: api/Users/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(Guid id)
        {
            var deleted = await _userService.DeleteUserAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
