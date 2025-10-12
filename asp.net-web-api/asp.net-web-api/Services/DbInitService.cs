using asp.net_web_api.Interfaces;
using asp.net_web_api.Models;
using asp.net_web_api.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace asp.net_web_api.Services
{
    public class DbInitService : IDbInitService
    {
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public DbInitService(AppDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public void Dispose()
        {
            _context.Dispose(); 
        }

        public bool Initialize()
        {
            _context.Database.Migrate();

            if (!_context.Users.Any())
            {
                var res = _userManager.CreateAsync(new AppUser { Email = "test@tj.com", UserName = "test" }, "Password.1234").GetAwaiter().GetResult();
            }

            return true;
        }
    }
}
