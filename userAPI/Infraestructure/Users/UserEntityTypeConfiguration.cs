using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using userAPI.Domain.Users;
using userAPI.Infrastructure;

namespace userAPI.Infrastructure.Users
{
    public class UserEntityTypeConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            //builder.ToTable("Users", SchemaNames.userAPI);
            builder.HasKey(b => b.Id);
        }
    }
}