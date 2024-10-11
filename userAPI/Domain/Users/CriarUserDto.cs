using userAPI.Domain.Users;

namespace userAPI.Domain.Users {
    public class CriarUserDto {
        public string nomeCompleto { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public UserRole func { get; private set; }
        public string telefone { get; set; }
        public string numMecanografico { get; set; }
        public string numeroContribuinte { get; set; }

        public CriarUserDto(string nomeCompleto, string email, string password, string telefone, string numMecanografico, string numeroContribuinte, UserRole func) {
            this.nomeCompleto = nomeCompleto;
            this.email = email;
            this.password = password;
            this.func = func;
            this.telefone = telefone;
            this.numMecanografico = numMecanografico;
            this.numeroContribuinte = numeroContribuinte;
        }
    }
}