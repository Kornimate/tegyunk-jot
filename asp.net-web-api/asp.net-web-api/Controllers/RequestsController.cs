using asp.net_web_api.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace asp.net_web_api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/requests")]
    public class RequestsController : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetRequests()
        {
            return await Task.FromResult(Ok());
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
