using userAPI.Domain.Shared;

namespace userAPI.Domain.Products
{
    public interface IProductRepository: IRepository<Product,ProductId>
    {
    }
}