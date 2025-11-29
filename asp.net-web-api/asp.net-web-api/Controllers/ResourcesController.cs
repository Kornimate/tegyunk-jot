using asp.net_web_api.DTOs;
using asp.net_web_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace asp.net_web_api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/resources")]
    public class ResourcesController : ControllerBase
    {
        private readonly PersistentDbContext _context;
        public ResourcesController(PersistentDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetResources()
        {
            return Ok(await _context.Resources
                                .OrderBy(x => x.Id)
                                .ToListAsync());
        }

        [HttpGet("machines")]
        public async Task<IActionResult> GetMachines()
        {
            return await Task.FromResult(Ok(Enum.GetValues<MachineTypes>()
                            .ToArray()
                            .Select(x => new MachineDto
                            {
                                Name = x.GetMachineName(),
                                Id = (int)x
                            })));
        }

        [HttpPut("update")]
        public async Task<IActionResult> PutNewResourceValue([FromBody] ResourcesDto dto)
        {
            var setting = await _context.Resources.FirstOrDefaultAsync(x => x.Id == dto.Id);

            if (setting is null)
                return BadRequest();

            setting.Value = dto.NewValue;

            await _context.Logs.AddAsync(new LogEntry
            {
                RecordedTime = DateTime.UtcNow,
                Important = true,
                Text = $"A(z) (#{setting.Id}) {setting.Name} új értéket kapott: {setting.Value}. {User.FindFirst(ClaimTypes.Name)?.Value} által"
            });

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
