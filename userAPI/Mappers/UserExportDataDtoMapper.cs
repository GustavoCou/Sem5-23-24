using userAPI.Domain.Users;

namespace userAPI.Mappers.Users
{
    public class UserExportDataDtoMapper
    {


        public static UserExportDataDto toDTO(UserDto user)
        {
            return new UserExportDataDto(user.nomeCompleto, user.email, user.telefone, user.numMecanografico, user.numeroContribuinte);
        }
    }
}