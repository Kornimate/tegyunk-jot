using asp.net_web_api.Interfaces;
using asp.net_web_api.Models;
using Microsoft.EntityFrameworkCore;

namespace asp.net_web_api.Services
{
    public class TemporaryDbCleaningService : ITemporaryDbCleaningService
    {
        private readonly IServiceProvider _sp;

        public TemporaryDbCleaningService(IServiceProvider sp)
        {
            _sp = sp;
        }

        public async Task<bool> RemoveOlderThan12DaysElements()
        {
            try
            {
                using var scope = _sp.CreateScope();
                using var context = scope.ServiceProvider.GetRequiredService<TemporaryDbContext>();
                
                await context.WebVisits
                                .Where(x => x.RecordedTime < DateTime.UtcNow.AddDays(-12))
                                .ExecuteDeleteAsync();
                
                await context.Logs
                                .Where(x => x.RecordedTime < DateTime.UtcNow.AddDays(-14))
                                .ExecuteDeleteAsync();

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
