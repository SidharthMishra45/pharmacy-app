using Microsoft.AspNetCore.Identity;
using System;

namespace Pharmacy.API.Models
{
    public class ApplicationRole : IdentityRole<Guid>
    {
        public ApplicationRole() : base() { }

        public ApplicationRole(string roleName) : base(roleName)
        {
            Id = Guid.NewGuid();
        }
    }
}
