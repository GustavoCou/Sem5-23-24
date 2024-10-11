using Microsoft.EntityFrameworkCore;
using userAPI.Domain.Categories;
using userAPI.Domain.Products;
using userAPI.Domain.Families;
using userAPI.Infrastructure.Categories;
using userAPI.Infrastructure.Products;
using userAPI.Domain.Users;
using userAPI.Infrastructure.Users;
using userAPI.Domain.Roles;
using userAPI.Infrastructure.Roles;

namespace userAPI.Infrastructure
{
    public class MySQLContext : DbContext {
        public DbSet<Category> Categories { get; set; }

        public DbSet<Product> Products { get; set; }

        public DbSet<Family> Families { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Role> Roles { get; set; }

        public string ConnectionString  { get; set; }

        public MySQLContext(DbContextOptions<MySQLContext> options) : base(options) {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            modelBuilder.ApplyConfiguration(new CategoryEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new ProductEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new FamilyEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new UserEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new RoleEntityTypeConfiguration());
        }
    }
}