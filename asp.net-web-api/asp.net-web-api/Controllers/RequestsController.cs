using asp.net_web_api.DTOs;
using asp.net_web_api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace asp.net_web_api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/requests")]
    public class RequestsController : ControllerBase
    {
        private AppDbContext _context;

        public RequestsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetRequests()
        {
            return Ok(await _context.Requests.ToListAsync());
        }

        [HttpPut("edit")]
        public async Task<IActionResult> PutRequestActivityChange([FromBody] RequestDto dto)
        {
            return await Task.FromResult(Ok());
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteRequest(int id)
        {
            return await Task.FromResult(Ok());
        }

    }
}
