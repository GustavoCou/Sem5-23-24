using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using userAPI.Domain.Families;

namespace userAPI.Infrastructure.Categories
{
    internal class FamilyEntityTypeConfiguration : IEntityTypeConfiguration<Family>
    {
        public void Configure(EntityTypeBuilder<Family> builder)
        {
            //builder.ToTable("Families", SchemaNames.userAPI);
            builder.HasKey(b => b.Id);
            //builder.Property<bool>("_active").HasColumnName("Active");
        }
    }
}