using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
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
        public DbSet<Inventory> Inventories { get; set; }

        public PharmacyDbContext() { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Inventory ID config
            modelBuilder.Entity<Inventory>()
                .Property(i => i.InventoryId)
                .ValueGeneratedOnAdd();

            // Order-OrderItem relation
            modelBuilder.Entity<Order>()
                .HasMany(o => o.OrderItems)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Supplier (ApplicationUser) - Orders relation
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Supplier)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.SupplierId)
                .OnDelete(DeleteBehavior.Restrict); // To prevent cascading delete if user is deleted
        }
    }
}
