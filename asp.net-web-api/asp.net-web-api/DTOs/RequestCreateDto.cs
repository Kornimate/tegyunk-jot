namespace asp.net_web_api.DTOs
{
    public class RequestCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public DateTime? PossibleStartDate { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
