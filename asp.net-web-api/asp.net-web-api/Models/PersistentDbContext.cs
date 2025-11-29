using asp.net_web_api.Users;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace asp.net_web_api.Models
{
    public class PersistentDbContext(DbContextOptions<PersistentDbContext> options) : IdentityDbContext<AppUser>(options)
    {
        public virtual DbSet<Resource> Resources { get; set; }
        public virtual DbSet<LogEntry> Logs { get; set; }
        public virtual DbSet<Request> Requests { get; set; }
    }
}
