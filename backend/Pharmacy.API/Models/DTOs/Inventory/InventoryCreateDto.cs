using System;
using System.ComponentModel.DataAnnotations;

namespace Pharmacy.API.DTOs
{
    public class InventoryCreateDto
    {
        [Required]
        public string DrugName { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public decimal Price { get; set; }

        [Required]
        public DateTime ExpiryDate { get; set; }
    }
}
