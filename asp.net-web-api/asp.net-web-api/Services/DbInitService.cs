using asp.net_web_api.Interfaces;
using asp.net_web_api.Models;
using Microsoft.EntityFrameworkCore;

namespace asp.net_web_api.Services
{
    public class DbInitService : IDbInitService
    {
        private readonly AppDbContext _context;
        public DbInitService(AppDbContext context)
        {
            _context = context;
        }

        public void Dispose()
        {
            _context.Dispose(); 
        }

        public bool Initialize()
        {
            _context.Database.Migrate();

            return true;
        }
    }
}
