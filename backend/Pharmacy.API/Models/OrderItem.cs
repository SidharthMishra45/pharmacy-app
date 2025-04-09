using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pharmacy.API.Models
{
    public class OrderItem
    {
        [Key]
        public Guid OrderItemId { get; set; }

        [Required]
        public Guid OrderId { get; set; }

        [ForeignKey("OrderId")]
        public Order Order { get; set; }

        [Required]
        public Guid DrugId { get; set; }

        [ForeignKey("DrugId")]
        public Drug Drug { get; set; }

        [Required]
        public int Quantity { get; set; }
    }
}
