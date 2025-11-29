using asp.net_web_api.DTOs;
using asp.net_web_api.Interfaces;
using asp.net_web_api.Models;
using asp.net_web_api.Users;
using ASP_Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.Security.Claims;

namespace asp.net_web_api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IJwtService _jwtService;
        private readonly AppDbContext _context;
        public AuthController(UserManager<AppUser> userManager, IJwtService jwtService, AppDbContext context)
        {
            _userManager = userManager;
            _jwtService = jwtService;
            _context = context;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginData)
        {
            if (string.IsNullOrWhiteSpace(loginData.Email) || string.IsNullOrWhiteSpace(loginData.Password))
                return BadRequest();

            var user = await _userManager.FindByEmailAsync(loginData.Email!);

            if (user is null)
                return Unauthorized();

            var loginAttemptIsSuccessful = await _userManager.CheckPasswordAsync(user, loginData.Password);

            if (loginAttemptIsSuccessful == true)
            {
                await _context.Logs.AddAsync(new LogEntry
                {
                    RecordedTime = DateTime.UtcNow,
                    Text = $"{user.UserName} bejelentkezett"
                });

                await _context.SaveChangesAsync();

                return Ok(new { Token = _jwtService.GenerateJwtToken(user), user.Email });
            }
            else
            {
                return Unauthorized();
            }
        }

        [Authorize]
        [HttpGet("fast")]
        public async Task<IActionResult> FastAuth()
        {
            await _context.Logs.AddAsync(new LogEntry
            {
                RecordedTime = DateTime.UtcNow,
                Text = $"{User.FindFirst(ClaimTypes.Name)?.Value} bejelentkezett"
            });

            await _context.SaveChangesAsync();

            return await Task.FromResult(Ok());
        }
    }
}
