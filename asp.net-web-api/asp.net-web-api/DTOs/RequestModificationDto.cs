using asp.net_web_api.Models;

namespace asp.net_web_api.DTOs
{
    public record RequestModificationDto
    {
        public int Id { get; set; }
        public int Machine { get; set; }
        public bool IsActive { get; set; }
    }
}
