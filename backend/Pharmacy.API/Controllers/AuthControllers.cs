using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Pharmacy.API.Models;
using Pharmacy.API.Services;
using System;
using System.Threading.Tasks;
using Pharmacy.API.Data; 
using Pharmacy.API.DTOs.Auth;

namespace Pharmacy.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly AuthService _authService;
        private readonly PharmacyDbContext _context; 

        public AuthController(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, AuthService authService, PharmacyDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _authService = authService;
            _context = context; 
        }

       
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            var userExists = await _userManager.FindByEmailAsync(model.Email);
            if (userExists != null)
                return BadRequest("User already exists!");

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                Name = model.Name,
                Role = model.Role 
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            if (!await _roleManager.RoleExistsAsync(model.Role))
                await _roleManager.CreateAsync(new ApplicationRole(model.Role));

            await _userManager.AddToRoleAsync(user, model.Role);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); 
            }


            return Ok(new { message = "User registered successfully!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {

            if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
            {
                return BadRequest("Email or password is empty.");
            }

            Console.WriteLine($"Login attempt: {model.Email}, {model.Password}");
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
                return Unauthorized("Invalid credentials!");

            var token = await _authService.GenerateJwtToken(user);
            return Ok(new { Token = token });
        }

    }
}
