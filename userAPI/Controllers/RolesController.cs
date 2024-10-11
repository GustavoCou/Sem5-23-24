using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using userAPI.Domain.Shared;
using userAPI.Domain.Roles;

namespace userAPI.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase {
        private readonly RoleService _service;

        public RolesController(RoleService service) {
            _service = service;
        }

        // GET: api/Roles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleDto>>> GetAll() {
            return await _service.GetAllAsync();
        }

        // GET: api/Roles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoleDto>> GetGetById(Guid id) {
            var role = await _service.GetByIdAsync(new RoleId(id));

            if (role == null) {
                return NotFound();
            }

            return role;
        }

        // POST: api/Roles
        [HttpPost]
        public async Task<ActionResult<RoleDto>> Create(CreatingRoleDto dto) {
            var role = await _service.AddAsync(dto);

            return CreatedAtAction(nameof(GetGetById), new { id = role.Id }, role);
        }

        
        // PUT: api/Roles/5
        [HttpPut("{id}")]
        public async Task<ActionResult<RoleDto>> Update(Guid id, RoleDto dto) {
            if (id != dto.Id) {
                return BadRequest();
            }

            try {
                var role = await _service.UpdateAsync(dto);
                
                if (role == null) {
                    return NotFound();
                }
                return Ok(role);
            }
            catch(BusinessRuleValidationException ex) {
                return BadRequest(new {Message = ex.Message});
            }
        }

        // Inactivate: api/Roles/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<RoleDto>> SoftDelete(Guid id) {
            var role = await _service.InactivateAsync(new RoleId(id));

            if (role == null) {
                return NotFound();
            }

            return Ok(role);
        }
        
        // DELETE: api/Roles/5
        [HttpDelete("{id}/hard")]
        public async Task<ActionResult<RoleDto>> HardDelete(Guid id) {
            try {
                var role = await _service.DeleteAsync(new RoleId(id));

                if (role == null) {
                    return NotFound();
                }

                return Ok(role);
            }
            catch(BusinessRuleValidationException ex)
            {
               return BadRequest(new {Message = ex.Message});
            }
        }
    }
}