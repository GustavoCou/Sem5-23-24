using userAPI.Infrastructure.Shared;
using userAPI.Domain.Users;
using userAPI.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;
using System.IO;
using System.Collections.Generic;


namespace userAPI.Infrastructure.Users
{
    public class UserRepository : BaseRepository<User, UserId>, IUserRepository
    {
        private readonly DbSet<User> _objs;
        private readonly MySQLContext _context;

        public UserRepository(MySQLContext context) : base(context.Users)
        {
            this._objs = context.Users;
            this._context = context;
        }

        public async Task<User> GetByDomainIdAsync(string email)
        {
            return await this._objs
                .Where(x => email.Equals(x.email)).FirstOrDefaultAsync();
        }

        public async Task<User> GetByNumeroContribuinteAsync(string numeroContribuinte)
        {
            return await this._objs
            .Where(x => numeroContribuinte.Equals(x.numeroContribuinte)).FirstOrDefaultAsync();
        }


        //para ir buscar os utentes com status de pendente (enum)
        public async Task<List<User>> GetUsersByApprovalStatusAsync(UserApprovalStatus status)
        {
            return await _objs
                .Where(u => u.approvalStatus == status && u.func == UserRole.Utente)
                .ToListAsync();
        }

        public async Task UpdateUserAsync(User user)
        {
            _objs.Update(user);
            await _context.SaveChangesAsync();
        }

    }
}