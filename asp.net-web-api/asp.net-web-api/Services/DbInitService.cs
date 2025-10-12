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

            if (!_context.Requests.Any())
            {
                _context.AddRange([
                    new Request{
                        Name = "TestName 1",
                        Email = "TestMail 1",
                        PhoneNumber = "1234567890",
                        Message = "TestMessage 1"
                    },
                    new Request{
                        Name = "TestName 2",
                        Email = "TestMail 2",
                        PhoneNumber = "1234567890",
                        Message = "TestMessage 2"
                    },
                    new Request{
                        Name = "TestName 3",
                        Email = "TestMail 3",
                        PhoneNumber = "1234567890",
                        Message = "TestMessage 3",
                        IsActiveRequest = true
                    }
                    ]);
            }

            if (!_context.Logs.Any())
            {
                _context.AddRange([
                    new LogEntry{
                        Text = "Test Log 1"
                    },
                    new LogEntry{
                        Text = "Test Log 2"
                    },
                    new LogEntry{
                        Text = "Test Log 3"
                    }
                    ]);
            }

            _context.SaveChanges();

            return true;
        }
    }
}
