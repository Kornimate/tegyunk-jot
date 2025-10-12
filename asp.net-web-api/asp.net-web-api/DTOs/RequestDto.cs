namespace asp.net_web_api.DTOs
{
    public record RequestDto
    {
        public int Id { get; set; }
        public bool IsActive { get; set; }
    }
}
