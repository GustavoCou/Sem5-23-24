using System.Threading.Tasks;
using System.Collections.Generic;
using userAPI.Domain.Shared;

namespace userAPI.Domain.Roles
{
    public class RoleService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRoleRepository _repo;

        public RoleService(IUnitOfWork unitOfWork, IRoleRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<RoleDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();
            
            List<RoleDto> listDto = list.ConvertAll<RoleDto>(role => new RoleDto{Id = role.Id.AsGuid(), Name = role.Name});

            return listDto;
        }

        public async Task<RoleDto> GetByIdAsync(RoleId id)
        {
            var role = await this._repo.GetByIdAsync(id);
            
            if(role == null)
                return null;

            return new RoleDto{Id = role.Id.AsGuid(), Name = role.Name};
        }

        public async Task<RoleDto> AddAsync(CreatingRoleDto dto)
        {
            var role = new Role(dto.Name);

            await this._repo.AddAsync(role);

            await this._unitOfWork.CommitAsync();

            return new RoleDto { Id = role.Id.AsGuid(), Name = role.Name };
        }

        public async Task<RoleDto> UpdateAsync(RoleDto dto)
        {
            var role = await this._repo.GetByIdAsync(new RoleId(dto.Id)); 

            if (role == null)
                return null;   

            // change all field
            role.ChangeName(dto.Name);
            
            await this._unitOfWork.CommitAsync();

            return new RoleDto { Id = role.Id.AsGuid(), Name = role.Name };
        }

        public async Task<RoleDto> InactivateAsync(RoleId id)
        {
            var role = await this._repo.GetByIdAsync(id); 

            if (role == null)
                return null;   

            // change all fields
            role.MarkAsInative();
            
            await this._unitOfWork.CommitAsync();

            return new RoleDto { Id = role.Id.AsGuid(), Name = role.Name };
        }

         public async Task<RoleDto> DeleteAsync(RoleId id)
        {
            var role = await this._repo.GetByIdAsync(id); 

            if (role == null)
                return null;   

            if (role.Active)
                throw new BusinessRuleValidationException("It is not possible to delete an active role.");
            
            this._repo.Remove(role);
            await this._unitOfWork.CommitAsync();

            return new RoleDto { Id = role.Id.AsGuid(), Name = role.Name };
        }
    }
}