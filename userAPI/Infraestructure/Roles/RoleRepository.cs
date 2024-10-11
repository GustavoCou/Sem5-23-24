using userAPI.Domain.Roles;
using userAPI.Infrastructure.Shared;

namespace userAPI.Infrastructure.Roles
{
    public class RoleRepository : BaseRepository<Role, RoleId>, IRoleRepository
    {
    
        public RoleRepository(MySQLContext context):base(context.Roles)
        {
           
        }


    }
}