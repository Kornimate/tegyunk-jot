using asp.net_web_api.DTOs;
using asp.net_web_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace asp.net_web_api.Controllers
{
    [ApiController]
    [Route("api/webvisit")]
    public class WebVisitController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WebVisitController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAnalytics()
        {
            var today = DateTime.UtcNow.Date;

            var last14days = Enumerable
                                .Range(0, 10)
                                .Select(x => today.AddDays((-1) * x))
                                .ToList();

            var visitCounts = await _context.WebVisits.
                                    Where(x => x.RecordedTime >= today.AddDays(-9))
                                    .GroupBy(x => x.RecordedTime.Date)
                                    .Select(x => new
                                    {
                                        Date = x.Key,
                                        Count = x.Count()
                                    })
                                    .ToListAsync();

            var result = last14days
                                .GroupJoin(
                                    visitCounts,
                                    day => day,
                                    visit => visit.Date,
                                    (day, visits) => new
                                    {
                                        Date = day,
                                        Visits = visits.FirstOrDefault()?.Count ?? 0
                                    })
                                .OrderBy(x => x.Date)
                                .ToList();

            return Ok(result);
        }

        [Authorize]
        [HttpGet("coordinates")]
        public async Task<IActionResult> GetVisitCoordinates()
        {
            return Ok(await _context.WebVisits
                                .Where(x => x.RecordedTime >= DateTime.UtcNow.Date.AddDays(-9))
                                .Select(x => new WebVisitDto
                                {
                                    Id = x.Id.ToString(),
                                    Name = $"Hely",
                                    Coords = new[] { x.LatitudeCoord, x.LongitudeCoord }
                                })
                                .ToListAsync());
        }

        [AllowAnonymous]
        [HttpPost("new")]
        public async Task<IActionResult> PostNewVisit([FromBody] WebVisitDto dto)
        {
            await _context.AddAsync(new WebVisit
            {
                LatitudeCoord = dto.Coords[0],
                LongitudeCoord = dto.Coords[1],
            });

            return Ok();
        }
    }
}
