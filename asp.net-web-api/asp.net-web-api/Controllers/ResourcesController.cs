using asp.net_web_api.DTOs;
using asp.net_web_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace asp.net_web_api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/resources")]
    public class ResourcesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ResourcesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetResources()
        {
            return Ok(await _context.Resources.ToListAsync());
        }

        [HttpPut("edit")]
        public async Task<IActionResult> PutNewResourceValue([FromBody] ResourcesDto dto)
        {
            var setting = await _context.Resources.FirstOrDefaultAsync(x => x.Id == dto.Id);

            if (setting is null)
                return BadRequest();

            setting.Value = dto.NewValue;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
