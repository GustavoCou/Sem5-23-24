using userAPI.Domain.Categories;
using userAPI.Infrastructure.Shared;

namespace userAPI.Infrastructure.Categories
{
    public class CategoryRepository : BaseRepository<Category, CategoryId>, ICategoryRepository
    {
    
        public CategoryRepository(MySQLContext context):base(context.Categories)
        {
           
        }


    }
}