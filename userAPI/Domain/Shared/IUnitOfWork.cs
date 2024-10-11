using System.Threading.Tasks;

namespace userAPI.Domain.Shared
{
    public interface IUnitOfWork
    {
        Task<int> CommitAsync();
    }
}