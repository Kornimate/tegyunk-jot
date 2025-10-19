namespace asp.net_web_api.DTOs
{
    public record LoginDto
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }
}
