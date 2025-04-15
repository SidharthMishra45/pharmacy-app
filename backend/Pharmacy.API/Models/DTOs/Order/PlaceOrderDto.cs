using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Pharmacy.API.DTOs
{
    public class PlaceOrderDto
    {
        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        public List<OrderItemDto> OrderItems { get; set; }
    }

    public class OrderItemDto
    {
        [Required]
        public Guid DrugId { get; set; }

        [Required]
        public int Quantity { get; set; }
    }
}
