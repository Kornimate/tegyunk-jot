using asp.net_web_api.DTOs;
using asp.net_web_api.Interfaces;
using asp.net_web_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace asp.net_web_api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/requests")]
    public class RequestsController : ControllerBase
    {
        private PersistentDbContext _context;
        private IEmailService _emailService;

        public RequestsController(PersistentDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [HttpGet]
        public async Task<IActionResult> GetRequests()
        {
            return Ok(await _context.Requests
                                .Where(x => !x.IsDeleted)
                                .OrderBy(x => x.CreatedTime)
                                .ToListAsync());
        }

        [HttpPut("update")]
        public async Task<IActionResult> PutRequestActivityChange([FromBody] RequestModificationDto dto)
        {
            var request = await _context.Requests.FirstOrDefaultAsync(x => x.Id == dto.Id);

            if (request is null)
                return BadRequest();

            request.IsActiveRequest = dto.IsActive;
            request.ActivatedDate = DateTime.UtcNow;
            request.Machine = (MachineTypes)dto.Machine;

            await _context.Logs.AddAsync(new LogEntry
            {
                RecordedTime = DateTime.UtcNow,
                Important = true,
                Text = $"A (#{request.Id}) {(dto.IsActive ? "ajánlatkérés" : "aktív bérlés")} állapotát megváltoztatta {(dto.IsActive? "aktívra" : "nem aktívra")} {User.FindFirst(ClaimTypes.Name)?.Value}"
            });

            await _context.SaveChangesAsync();

            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("new")]
        public async Task<IActionResult> PostNewRequest([FromBody] RequestCreateDto dto)
        {
            await _context.AddAsync(new Request
            {
                Name = dto.Name,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                PossibleStartDate = dto.PossibleStartDate,
                Message = dto.Message,
                CreatedTime = DateTime.UtcNow
            });

            await _context.Logs.AddAsync(new LogEntry
            {
                RecordedTime = DateTime.UtcNow,
                Text = $"Új ajánlatkérést rögzített a rendszer"
            });

            await _context.SaveChangesAsync();

            await _emailService.SendResponseToRequest(dto.Email);
            await _emailService.SendNotificationToInbox(dto);

            return Created();
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteRequest([FromRoute] int id)
        {
            var request = await _context.Requests.FirstOrDefaultAsync(x => x.Id == id);

            if (request is null)
                return BadRequest();

            request.IsDeleted = true;
            request.IsActiveRequest = false;
            request.ActivatedDate = null;
            request.FinishedDate = null;

            await _context.Logs.AddAsync(new LogEntry
            {
                RecordedTime = DateTime.UtcNow,
                Important = true,
                Text = $"Az (#{id}) elem törölve lett {User.FindFirst(ClaimTypes.Name)?.Value} által"
            });

            await _context.SaveChangesAsync();

            return Ok();
        }

    }
}
