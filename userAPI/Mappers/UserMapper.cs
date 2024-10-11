using userAPI.Domain.Users;

namespace userAPI.Mappers.Users {
    public class UserMapper {
        public static User toDomain(string nomeCompleto, string email, string pass, string telefone, string numMecanografico, string numeroContribuinte,  UserRole func) {
            return new User(nomeCompleto, email, pass, telefone, numMecanografico, numeroContribuinte, func);
        }

        public static UserDto toDTO(User user) {
            return new UserDto(user.Id.AsGuid(), user.nomeCompleto, user.email, user.password, user.telefone, user.numMecanografico, user.numeroContribuinte, user.func,user.approvalStatus);
        }
    }
}