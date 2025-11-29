using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;

namespace asp.net_web_api.Models
{
    public class TemporaryDbContext(DbContextOptions<TemporaryDbContext> options) : DbContext(options)
    {
        public virtual DbSet<LogEntry> Logs { get; set; }
        public virtual DbSet<WebVisit> WebVisits { get; set; }

    }
}
