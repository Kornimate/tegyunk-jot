using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace asp.net_web_api.Models
{
    public class Request
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [NotNull]
        public string Name { get; set; } = string.Empty;

        [NotNull]
        public string Email { get; set; } = string.Empty;

        [NotNull]
        public string PhoneNumber {  get; set; } = string.Empty;

        [NotNull]
        public string Message { get; set; } = string.Empty;

        [NotNull]
        public MachineTypes Machine { get; set; } = MachineTypes.NONE;

        public DateTime? PossibleStartDate { get; set; }
        public DateTime? ActivatedDate { get; set; }
        public DateTime? FinishedDate { get; set; }
        public bool IsActiveRequest { get; set; } = false;
        public bool IsDeleted { get; set; } = false;
    }
}
