using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using userAPI.Domain.Roles;

namespace userAPI.Infrastructure.Roles
{
    internal class RoleEntityTypeConfiguration : IEntityTypeConfiguration<Role>
    {
        public void Configure(EntityTypeBuilder<Role> builder)
        {
            builder.HasKey(b => b.Id);
        }
    }
}