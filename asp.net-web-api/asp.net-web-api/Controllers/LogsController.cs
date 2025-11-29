using asp.net_web_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SQLitePCL;

namespace asp.net_web_api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/logs")]
    public class LogsController : ControllerBase
    {
        private PersistentDbContext _context;

        public LogsController(PersistentDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetLogs()
        {
            return Ok(await _context.Logs
                                .Where(x => x.RecordedTime >= DateTime.UtcNow.Date.AddDays(-13))
                                .OrderByDescending(x => x.RecordedTime)
                                .ToListAsync());
        }
    }
}
