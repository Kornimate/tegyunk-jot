using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace asp.net_web_api.Models
{
    public class WebVisit
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        public double? LongitudeCoord { get; set; }

        public double? LatitudeCoord { get; set; }

        [NotNull]
        public DateTime RecordedTime { get; set; } = DateTime.UtcNow.Date;

    }
}
