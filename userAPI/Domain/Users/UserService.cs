using System.Threading.Tasks;
using userAPI.Domain.Shared;
using userAPI.Mappers.Users;
using System.Collections.Generic;
using System;
using userAPI.Infrastructure.Users;
using System.IO;
using System.Text.Json;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace userAPI.Domain.Users
{
    public class UserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _repo;

        public UserService(IUnitOfWork unitOfWork, IUserRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<UserDto> AddAsync(CriarUserDto dto)
        {
            try
            {
                var user = UserMapper.toDomain(dto.nomeCompleto, dto.email,
                    EncryptPass.ComputeHash(dto.password, "SHA512", null), dto.telefone, dto.numMecanografico,
                    dto.numeroContribuinte, dto.func);

                await this._repo.AddAsync(user);

                await this._unitOfWork.CommitAsync();

                return UserMapper.toDTO(user);
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException is SqlException sqlException &&
                    (sqlException.Number == 2627 || sqlException.Number == 2601))
                {
                    throw new BusinessRuleValidationException("Email já está em uso.");
                }
                else
                {
                    throw new BusinessRuleValidationException("Error em gravar utilizador .");
                }
            }
        }

        public async Task<UserDto> GetByDomainIdAsync(string id)
        {

            var user = await this._repo.GetByDomainIdAsync(id);

            if (user == null)
            {

                return null;
            }

            return UserMapper.toDTO(user);
        }

        public async Task<UserDto> AuthenticateUser(string id, string password)
        {
            var user = await this._repo.GetByDomainIdAsync(id);
            Console.WriteLine("USER INSIDE AUTH --------------------------------------------------------------------------------");
            Console.WriteLine(user.email + " --------------------------------------------------------------------------------");

            if (user == null)
            {
                Console.WriteLine("USER INSIDE AUTH --------------------------------------------------------------------------------");
                Console.WriteLine(" IF USER NULL--------------------------------------------------------------------------------");
                return null;
            }

            if (!EncryptPass.VerifyHash(password, "SHA512", user.password))
            {
                Console.WriteLine("USER INSIDE AUTH --------------------------------------------------------------------------------");
                Console.WriteLine(" IF PASS NOT ENCRYPT--------------------------------------------------------------------------------");
                return null;
            }

            return UserMapper.toDTO(user);
        }

        public async Task<List<UserDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();

            List<UserDto> listDto = list.ConvertAll<UserDto>(user =>
                new UserDto(user.Id.AsGuid(), user.nomeCompleto, user.email, user.password, user.telefone, user.numMecanografico, user.numeroContribuinte, user.func, user.approvalStatus));

            return listDto;
        }

        public async Task<string> WriteUserDataToJsonFile(UserDto user, string id)
        {
            if (user == null)
            {

                return null;
            }

            var userExportData = UserExportDataDtoMapper.toDTO(user);

            var jsonString = System.Text.Json.JsonSerializer.Serialize(userExportData, new JsonSerializerOptions { WriteIndented = true });
            var safeFileName = $"PersonalData_{id}.json";
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), safeFileName);

            await File.WriteAllTextAsync(filePath, jsonString);
            return filePath;
        }

        public async Task<UserRole?> GetUserRoleByIdAsync(UserDto userIdEmail)
        {

            return (UserRole)userIdEmail.func;
        }
        public string GenerateJwtToken(UserDto user)
        {
            Console.WriteLine("START TOKEN METHOD------------------------------------------------------------------------------");
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("YourSuperSecretKeyShouldbeverybutverybig")); // Replace with a secret key from your configuration
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            Console.WriteLine("CLAIM LIST------------------------------------------------------------------------------");
            var claims = new List<Claim>
            {
            new Claim(JwtRegisteredClaimNames.Sub, user.email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Sid, user.Id.ToString())
            };
            Console.WriteLine("TOKEN INSTANTIATION------------------------------------------------------------------------------");
            var token = new JwtSecurityToken(
                issuer: "YourIssuer", // Replace with your issuer
                audience: "YourAudience", // Replace with your audience
                claims: claims,
                expires: DateTime.Now.AddHours(1), // Token expiration time
                signingCredentials: credentials
            );
            Console.WriteLine("ABOUT TO RETURN------------------------------------------------------------------------------");
            Console.WriteLine(token.ToString() + "TOKEN INSTANTIATION------------------------------------------------------------------------------");
            return new JwtSecurityTokenHandler().WriteToken(token);
        }



        public async Task<List<UserDto>> GetPendingUtentesAsync()
        {
            var pendingUtentes = await _repo.GetUsersByApprovalStatusAsync(UserApprovalStatus.Pending);

            List<UserDto> listDto = pendingUtentes.ConvertAll<UserDto>(user =>
               new UserDto(user.Id.AsGuid(), user.nomeCompleto, user.email, user.password, user.telefone, user.numMecanografico, user.numeroContribuinte, user.func, user.approvalStatus));

            return listDto;
        }

        public async Task<bool> ChangeUserApprovalStatusAsync(UserDto userUpdateDto)
        {
            var user = await _repo.GetByDomainIdAsync(userUpdateDto.email);

            if (user == null)
            {
                return false;
            }

            user.ChangeApprovalStatus(userUpdateDto.approvalStatus);

            await _repo.UpdateUserAsync(user);
            await _unitOfWork.CommitAsync();

            return true;
        }

        public async Task<UserDto> UpdateAsync(string numeroContribuinte, UserDto dto)
        {

            var existingUser = await _repo.GetByNumeroContribuinteAsync(numeroContribuinte);

            if (existingUser == null)
            {
                throw new BusinessRuleValidationException("Usuário não encontrado.");
            }

            // Certifique-se de que o número de contribuinte não seja alterado
            if (existingUser.numeroContribuinte != dto.numeroContribuinte)
            {
                throw new BusinessRuleValidationException("O número de contribuinte não pode ser alterado.");
            }

            existingUser.UpdateDetails(dto.nomeCompleto, dto.telefone, dto.numMecanografico, dto.numeroContribuinte, dto.func);

            await _repo.UpdateUserAsync(existingUser);
            await _unitOfWork.CommitAsync();

            return UserMapper.toDTO(existingUser);
        }
        public async Task<UserDto> CancelUserAsync(UserId id)
        {
            var user = await this._repo.GetByIdAsync(id);

            if (user == null)
                return null;

            user.Anonymize();
            await this._repo.UpdateUserAsync(user);
            await this._unitOfWork.CommitAsync();

            return UserMapper.toDTO(user);
        }

    }
}


// UserService está responsável por operações de alto nível, como adição, obtenção, autenticação, exclusão e atualização de usuários. Além disso, ela interage com o repositório e faz a ponte entre a camada de aplicação e a camada de persistência.