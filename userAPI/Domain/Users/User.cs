using System;
using System.Text.RegularExpressions;
using userAPI.Domain.Shared;

namespace userAPI.Domain.Users
{
    public class User : Entity<UserId>, IAggregateRoot
    {
        public string nomeCompleto { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public UserRole func { get; set; }
        public string telefone { get; set; }
        public string numMecanografico { get; set; }
        public string numeroContribuinte { get; set; }

        public UserApprovalStatus approvalStatus { get; set; }

        public User()
        {
        }

        private Boolean verificaUser(string nomeCompleto, string email, string password, string telefone, string numMecanografico, string numeroContribuinte, UserRole func)
        {

            if (nomeCompleto == null || email == null || password == null || telefone == null || numMecanografico == null || telefone == null || numeroContribuinte == null)
            {

                return false;
            }

            return Enum.IsDefined(typeof(UserRole), func);
        }


        private Boolean validaPassword(string password)
        {
            const string passwordPattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d\s]).{10,}$";

            if (string.IsNullOrWhiteSpace(password))
            {
                throw new BusinessRuleValidationException("A senhanão pode estar vacía.", nameof(password));
            }

            if (!Regex.IsMatch(password, passwordPattern))
            {
                throw new BusinessRuleValidationException("A senha deve ter pelo menos 10 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um dígito e um dos seguintes símbolos: @$!%*?&");
            }

            return true;
        }

        public User(string nomeCompleto, string email, string password, string telefone, string numMecanografico, string numeroContribuinte)
        {
            // Para um usuário normal (utente), o papel é definido como UserRole.Utente por padrão
            UserRole role = UserRole.Utente;


            if (!verificaUser(nomeCompleto, email, password, telefone, numMecanografico, numeroContribuinte, role) || !validaPassword(password))
            {

                throw new BusinessRuleValidationException("Utilizador inválido");
            }

            if (!email.EndsWith("isep.ipp.pt"))
            {
                throw new BusinessRuleValidationException("Apenas são aceites emails da organização");
            }

            this.Id = new UserId(Guid.NewGuid());
            this.nomeCompleto = nomeCompleto;
            this.email = email;
            this.password = password;
            this.func = role;


            this.telefone = telefone;
            this.numMecanografico = numMecanografico;
            this.numeroContribuinte = numeroContribuinte;
            this.approvalStatus = UserApprovalStatus.Pending;
        }

        // Construtor adicional para o administrador que precisa fornecer um papel específico
        public User(string nomeCompleto, string email, string password, string telefone, string numMecanografico, string numeroContribuinte, UserRole func)
        {
            if (!verificaUser(nomeCompleto, email, password, telefone, numMecanografico, numeroContribuinte, func) || !validaPassword(password))
            {
                throw new BusinessRuleValidationException("Utilizador inválido");
            }

            if (!email.EndsWith("isep.ipp.pt"))
            {
                throw new BusinessRuleValidationException("Apenas são aceites emails da organização");
            }

            this.Id = new UserId(Guid.NewGuid());
            this.nomeCompleto = nomeCompleto;
            this.email = email;
            this.password = password;
            this.func = func;
            this.telefone = telefone;

            this.numMecanografico = numMecanografico;
            this.numeroContribuinte = numeroContribuinte;
            this.approvalStatus = UserApprovalStatus.Pending;

        }

        public String toString()
        {
            return this.Id.AsString();
        }

        public void ChangeApprovalStatus(UserApprovalStatus newStatus)
        {

            this.approvalStatus = newStatus;
        }

        public void UpdateDetails(string nomeCompleto, string telefone, string numMecanografico, string numeroContribuinte, UserRole func)
        {
            if (string.IsNullOrWhiteSpace(nomeCompleto) || string.IsNullOrWhiteSpace(telefone) || string.IsNullOrWhiteSpace(numMecanografico) || string.IsNullOrWhiteSpace(numeroContribuinte) || func == 0)
            {
                throw new BusinessRuleValidationException("Todos os detalhes devem ser fornecidos para atualização.");
            }

            this.nomeCompleto = nomeCompleto;
            this.telefone = telefone;
            this.numMecanografico = numMecanografico;
            this.numeroContribuinte = numeroContribuinte;
            this.func = func;
        }

        public void Anonymize()
        {
            this.nomeCompleto = null;
            this.email = null;
            this.password = null;
            this.telefone = null;

            this.numMecanografico = null;
            this.numeroContribuinte = null;
            this.approvalStatus = UserApprovalStatus.Canceled;
        }
    }
}

//User contém a lógica relacionada à criação de instâncias válidas de usuários, garantindo que as verificações de validação sejam realizadas no momento da criação.