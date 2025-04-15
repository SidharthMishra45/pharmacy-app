using System;
using System.Collections.Generic;

namespace Pharmacy.API.DTOs
{
    public class OrderResponseDto
    {
        public Guid OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }

        public List<OrderItemResponseDto> OrderItems { get; set; }
    }

    public class OrderItemResponseDto
    {
        public Guid DrugId { get; set; }
        public string DrugName { get; set; } 
        public int Quantity { get; set; }
        public decimal Price { get; set; }  
    }
}
