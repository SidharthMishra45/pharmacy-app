using System;
using System.ComponentModel.DataAnnotations;

namespace Pharmacy.API.Models
{
    public class TransactionDetail
    {
        [Key]
        public Guid TransactionId { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string Status { get; set; } 

        [Required]
        public string PaymentMethod { get; set; }

        public decimal Amount { get; set; }
    }
}
