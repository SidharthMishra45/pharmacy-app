using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pharmacy.API.Models
{
    public class Order
    {
        [Key]
        public Guid OrderId { get; set; }

        [Required]

        public Guid DoctorId { get; set; }

        [ForeignKey("DoctorId")]


        public ApplicationUser Doctor { get; set; } 

        [Required]
        public DateTime OrderDate { get; set; }

        [Required]
        public string Status { get; set; }

        public decimal TotalAmount { get; set; }
        
        public Guid? TransactionId { get; set; } 
        
        [ForeignKey("TransactionId")]
        public TransactionDetail? TransactionDetail { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
