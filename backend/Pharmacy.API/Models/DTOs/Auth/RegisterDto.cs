using System.ComponentModel.DataAnnotations;

namespace Pharmacy.API.DTOs.Auth
{
    public class RegisterDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }

        [Required]
        [Compare("Password", ErrorMessage = "Passwords do not match")]
        public string ConfirmPassword { get; set; }

        [Required]
        [RegularExpression("^(Admin|Doctor|Supplier)$", ErrorMessage = "Role must be Admin, Doctor, or Supplier")]
        public string Role { get; set; }
    }
}
