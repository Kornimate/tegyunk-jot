namespace asp.net_web_api.DTOs
{
    public record WebVisitDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public double[] Coords { get; set; } = [];
    }
}
