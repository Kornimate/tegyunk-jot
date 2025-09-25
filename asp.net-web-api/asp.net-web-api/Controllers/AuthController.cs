using asp.net_web_api.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel;

namespace asp.net_web_api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        [HttpPost("login")]

        public IActionResult Login(LoginDTO loginData)
        {
            return Ok();
        }
    }
}
