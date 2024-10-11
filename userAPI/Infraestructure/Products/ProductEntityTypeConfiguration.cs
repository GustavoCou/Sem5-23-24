using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using userAPI.Domain.Products;

namespace userAPI.Infrastructure.Products
{
    internal class ProductEntityTypeConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            //builder.ToTable("Products", SchemaNames.userAPI);
            builder.HasKey(b => b.Id);
        }
    }
}