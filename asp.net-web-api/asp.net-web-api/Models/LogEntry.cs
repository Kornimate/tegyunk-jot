using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace asp.net_web_api.Models
{
    public class LogEntry
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [NotNull]
        public string Text { get; set; } = string.Empty;
    }
}
