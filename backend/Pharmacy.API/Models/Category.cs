using System;
using System.ComponentModel.DataAnnotations;

namespace Pharmacy.API.Models
{
    public class Category
    {
        [Key]
        public Guid CategoryId { get; set; }

        [Required]
        public string CategoryName { get; set; }
    }
}
