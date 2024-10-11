
using userAPI.Domain.Shared;

namespace userAPI.Domain.Categories
{
    public interface ICategoryRepository: IRepository<Category, CategoryId>
    {
    }
}