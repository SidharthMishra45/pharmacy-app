using Pharmacy.API.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pharmacy.API.Models
{
    public class Inventory
    {
        public Guid InventoryId { get; set; } = Guid.NewGuid();

        public Guid SupplierId { get; set; }
        public Guid DrugId { get; set; }
        public long Quantity { get; set; }

        [ForeignKey("SupplierId")]
        public ApplicationUser Supplier { get; set; } // if Supplier is a User
        public Drug Drug { get; set; }
    }
}