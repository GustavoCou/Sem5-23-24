using userAPI.Domain.Families;
using userAPI.Infrastructure.Shared;

namespace userAPI.Infrastructure.Families
{
    public class FamilyRepository : BaseRepository<Family, FamilyId>, IFamilyRepository
    {
      
        public FamilyRepository(MySQLContext context):base(context.Families)
        {
            
        }

    }
}