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
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAnalytics()
        {
            var today = DateTime.UtcNow.Date;

            var last14days = Enumerable
                                .Range(0, 14)
                                .Select(x => today.AddDays((-1) * x))
                                .ToList();

            var visitCounts = await _context.WebVisits.
                                    Where(x => x.RecordedTime >= today.AddDays(-13) && x.RecordedTime <= today)
                                    .GroupBy(x => x.RecordedTime.Date)
                                    .Select( x=> new
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

        private readonly AppDbContext _context;

        public WebVisitController(AppDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpPost("new")]
        public async Task<IActionResult> PostNewVisit([FromBody] WebVisitDto dto)
        {
            await _context.AddAsync(new WebVisit
            {
                LongitudeCoord = dto.LongitudeCoord,
                LatitudeCoord = dto.LatitudeCoord,
            });

            return Ok();
        }
    }
}
