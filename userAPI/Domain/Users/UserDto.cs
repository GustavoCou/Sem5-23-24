using System;

namespace userAPI.Domain.Users
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string nomeCompleto { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public UserRole func { get; set; }
        public string telefone { get; set; }
        public string numMecanografico { get; set; }
        public string numeroContribuinte { get; set; }

        public UserApprovalStatus approvalStatus { get; set; }
        
        public UserDto()
        {
       
        }

        public UserDto(Guid Id, string nomeCompleto, string email, string password, string telefone, string numMecanografico, string numeroContribuinte, UserRole func, UserApprovalStatus approvalStatus)
        {
            this.Id = Id;
            this.nomeCompleto = nomeCompleto;
            this.email = email;
            this.password = password;
            this.func = func;
            this.telefone = telefone;
            this.numMecanografico = numMecanografico;
            this.numeroContribuinte = numeroContribuinte;
            this.approvalStatus = approvalStatus;
        }

        public UserDto(Guid Id, string nomeCompleto, string email, UserRole func, string telefone, string numMecanografico, string numeroContribuinte)
        {
            this.Id = Id;
            this.nomeCompleto = nomeCompleto;
            this.email = email;
            this.func = func;
            this.telefone = telefone;
            this.numMecanografico = numMecanografico;
            this.numeroContribuinte = numeroContribuinte;
        }

        public UserDto(string email, UserApprovalStatus approvalStatus)
        {
            
            this.email = email;
            this.approvalStatus = approvalStatus;
        }

    }
}