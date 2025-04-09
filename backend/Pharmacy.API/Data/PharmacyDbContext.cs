using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Pharmacy.API.Models;


namespace Pharmacy.API.Data
{
    public class PharmacyDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
    {
        public PharmacyDbContext(DbContextOptions<PharmacyDbContext> options) : base(options) { }

        
        public DbSet<Drug> Drugs { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<TransactionDetail> TransactionDetails { get; set; }
        public DbSet<Category> Categories { get; set; }
        public PharmacyDbContext() { }

       protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            
            modelBuilder.Entity<Order>()
                .HasMany(o => o.OrderItems)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        }

         
    }
}
