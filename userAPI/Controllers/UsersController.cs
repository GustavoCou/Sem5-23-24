using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using userAPI.Domain.Shared;
using Microsoft.Extensions.Logging;
using userAPI.Domain.Users;
using System.IO;
using System.Linq;

namespace userAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserService _service;



        public UsersController(UserService service)
        {
            _service = service;


        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        //  GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetByDomainId(string id)
        {
            var user = await _service.GetByDomainIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }


        [HttpGet("personaldata/{id}")]
        public async Task<ActionResult> GetPersonalData(string id)
        {

            try
            {

                var userDto = await _service.GetByDomainIdAsync(id);

                if (userDto == null)
                {

                    return NotFound($"User com {id} nao encontrado.");
                }

                var role = await _service.GetUserRoleByIdAsync(userDto);

                if (role != UserRole.Utente)
                {//403 Forbidden

                    return StatusCode(403, "apenas é possivel obter dados pessoais se for utente.");
                }

                else
                {

                    var filePath = await _service.WriteUserDataToJsonFile(userDto, id);
                    if (filePath == null)
                    {
                        //500 Internal Server Error
                        return StatusCode(500, "Erro ao gerar ficheiro");
                    }

                    var fileName = Path.GetFileName(filePath);

                    Response.Headers.Add("Content-Disposition", $"attachment; filename={fileName}");

                    var bytes = await System.IO.File.ReadAllBytesAsync(filePath);

                    return File(bytes, "application/json", fileName);
                }
            }
            catch (BusinessRuleValidationException ex)
            {

                return BadRequest(new { message = ex.Message, details = ex.Details });
            }

            catch (Exception ex) //outras excepcoes que nao seja de business rule validation
            {

                // Console.WriteLine($"Erro: {ex.Message}");
                return StatusCode(500, "Erro ao gerar pedido.");
            }
        }


        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<UserDto>> Create(CriarUserDto dto)
        {
            try
            {
                Console.WriteLine(dto);
                var user = await _service.AddAsync(dto);

                return CreatedAtAction(nameof(GetByDomainId), new { id = user.email }, user);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }


        [HttpPost("Authenticate")]
        public async Task<ActionResult> AuthenticateUser(AuthDto dto)
        {
            var user = await _service.AuthenticateUser(dto.email, dto.password);

            if (user == null)
            {
                return NotFound(new { Message = "User not found." }); // Return 404 with a specific message
            }

            // Verify the password
            bool isPasswordValid = EncryptPass.VerifyHash(dto.password, "SHA512", user.password);

            if (!isPasswordValid)
            {
                return BadRequest(new { Message = "Incorrect password." }); // Return 400 with a specific message
            }

            // Generate JWT token
            var token = _service.GenerateJwtToken(user);

            // Return only the token and necessary user data
            return Ok(new { Token = token, UserId = user.Id, UserName = user.nomeCompleto, role = user.func, status = user.approvalStatus });
        }


        // GET: api/Users/PendingUtentes
        [HttpGet("PendingUtentes")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetPendingUtentes()
        {
            var pendingUtentes = await _service.GetPendingUtentesAsync();

            if (pendingUtentes == null || !pendingUtentes.Any())
            {
                return Ok(new List<UserDto>());
            }

            return Ok(pendingUtentes);
        }

        [HttpPut("{email}/updatestatus")]
        public async Task<IActionResult> UpdateUserApprovalStatus(string email, [FromBody] UserDto userUpdateDto)
        {

            if (email != userUpdateDto.email)
            {

                return BadRequest("O email de utente não coincide com o solicitado.");
            }

            var result = await _service.ChangeUserApprovalStatusAsync(userUpdateDto);

            if (!result)
            {

                return BadRequest("Não foi possivel atualizar utente");
            }

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> CancelUser(Guid id)
        {
            try
            {
                var user = await _service.CancelUserAsync(new UserId(id));

                if (user == null)
                {
                    return NotFound();
                }

                return Ok(user);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
        // PUT: api/Users/5
        [HttpPut("{numeroContribuinte}")]
        public async Task<IActionResult> UpdateUser(string numeroContribuinte, UserDto userUpdateDto)
        {
            // Solicitar ao serviço a busca pelo usuário usando o número de contribuinte
            try
            {
                var updatedUser = await _service.UpdateAsync(numeroContribuinte, userUpdateDto);
                return Ok(updatedUser);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}