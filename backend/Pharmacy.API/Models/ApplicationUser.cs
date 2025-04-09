using Microsoft.AspNetCore.Identity;

namespace Pharmacy.API.Models
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public string Name { get; set; }

        public string Role { get; set;}
    }
}
