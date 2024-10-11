using System;
using userAPI.Domain.Shared;

namespace userAPI.Domain.Roles
{
    public class Role : Entity<RoleId>, IAggregateRoot
    {
     
        public string Name { get;  private set; }

        public bool Active{ get;  private set; }

        private Role()
        {
            this.Active = true;
        }

        public Role(string name)
        {
            this.Id = new RoleId(Guid.NewGuid());
            this.Name = name;
            this.Active = true;
        }

        public void ChangeName(string name)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("It is not possible to change the name to an inactive role.");
            this.Name = name;
        }
        
        public void MarkAsInative()
        {
            this.Active = false;
        }
    }
}