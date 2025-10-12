using asp.net_web_api.DTOs;
using asp.net_web_api.Models;
using asp.net_web_api.Users;
using ASP_Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;

namespace asp.net_web_api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly JwtService _jwtService;
        private readonly AppDbContext _context;
        public AuthController(UserManager<AppUser> userManager, JwtService jwtService, AppDbContext context)
        {
            _userManager = userManager;
            _jwtService = jwtService;
            _context = context;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginData)
        {
            if (string.IsNullOrWhiteSpace(loginData.Email) || string.IsNullOrWhiteSpace(loginData.Password))
                return BadRequest();

            var user = await _userManager.FindByEmailAsync(loginData.Email!);

            var users = await _context.Users.ToListAsync();

            if (user is null)
                return Unauthorized();

            var loginAttemptIsSuccessful = await _userManager.CheckPasswordAsync(user, loginData.Password);

            if (loginAttemptIsSuccessful == true)
                return Ok(new { Token = _jwtService.GenerateJwtToken(user), user.Email });
            else
                return Unauthorized();
        }
    }
}
