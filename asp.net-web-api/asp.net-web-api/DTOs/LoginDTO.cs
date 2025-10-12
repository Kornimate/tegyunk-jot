namespace asp.net_web_api.DTOs
{
    public record LoginDTO
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }
}
