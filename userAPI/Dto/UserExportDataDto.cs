using System;

namespace userAPI.Domain.Users
{

    public class UserExportDataDto
    {
        public string nomeCompleto { get; set; }
        public string email { get; set; }
        public string telefone { get; set; }
        public string numMecanografico { get; set; }
        public string numeroContribuinte { get; set; }


        public UserExportDataDto(string nomeCompleto, string email, string telefone, string numMecanografico, string numeroContribuinte)
        {
            this.nomeCompleto = nomeCompleto;
            this.email = email;
            this.telefone = telefone;
            this.numMecanografico = numMecanografico;
            this.numeroContribuinte = numeroContribuinte;

        }

    }
}
