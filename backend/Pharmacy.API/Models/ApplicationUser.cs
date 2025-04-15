using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace Pharmacy.API.Models
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public string Name { get; set; }

        public string Role { get; set; }

        public ICollection<Inventory> Inventories { get; set; }
        public ICollection<Order> Orders { get; set; }
    }
}
