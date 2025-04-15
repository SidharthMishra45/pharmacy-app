using System;

namespace Pharmacy.API.DTOs
{
    public class InventoryReadDto
    {
        public Guid InventoryId { get; set; }
        public string DrugName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public DateTime ExpiryDate { get; set; }

        public Guid SupplierId { get; set; }
        public string SupplierName { get; set; } 
    }
}
