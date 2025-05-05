namespace Pharmacy.API.DTOs.SalesReport
{
    public class SupplierSalesReportDto
    {
        public string OrderId { get; set; }          
        public string DrugName { get; set; }         
        public int Quantity { get; set; }           
        public decimal PricePerUnit { get; set; }    
        public decimal TotalDrugPrice { get; set; }  
        public decimal TotalOrderPrice { get; set; } 
    }

}
