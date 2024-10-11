using userAPI.Domain.Shared;
using System.Threading.Tasks;
using userAPI.Domain.Users;
using System.Collections.Generic;
using System.Linq;
using System;

namespace userAPI.Domain.Users
{
    public interface IUserRepository : IRepository<User, UserId>
    {
        Task<User> GetByDomainIdAsync(string email);
        Task<List<User>> GetUsersByApprovalStatusAsync(UserApprovalStatus status);

        Task UpdateUserAsync(User user);

        Task<User> GetByNumeroContribuinteAsync(string numeroContribuinte);
    }
}