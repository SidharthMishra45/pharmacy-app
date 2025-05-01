using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pharmacy.API.Models
{
    public class Inventory
    {
        [Key]
        public Guid InventoryId { get; set; }

        [Required]
        public string DrugName { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public decimal Price { get; set; }

        [Required]
        public DateTime ExpiryDate { get; set; }

        [Required]
        public Guid SupplierId { get; set; }

        [ForeignKey("SupplierId")]
        public ApplicationUser Supplier { get; set; }

    }
}