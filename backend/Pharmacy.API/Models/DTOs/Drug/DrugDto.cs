using System;
using System.ComponentModel.DataAnnotations;

namespace Pharmacy.API.Dtos
{
    public class DrugDto
    {
        public Guid? DrugId { get; set; }  

        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }


        [Required]
        public decimal Price { get; set; }

        [Required]
        public Guid CategoryId { get; set; }

        public string CategoryName { get; set; } 
    }
}
