using System;
using System.ComponentModel.DataAnnotations;

namespace Pharmacy.API.Dtos
{
    public class CreateDrugDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        [Required]
        public string CategoryName { get; set; } 
    }
}
