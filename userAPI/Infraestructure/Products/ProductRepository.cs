using userAPI.Domain.Products;
using userAPI.Infrastructure.Shared;

namespace userAPI.Infrastructure.Products
{
    public class ProductRepository : BaseRepository<Product, ProductId>,IProductRepository
    {
        public ProductRepository(MySQLContext context):base(context.Products)
        {
           
        }
    }
}