using asp.net_web_api.Interfaces;

namespace asp.net_web_api.Extensions
{
    public static class WebApplicationExtension
    {
        public static WebApplication UseDatabaseInitialization(this WebApplication webApplication)
        {
            using (var serviceScope = webApplication.Services.CreateScope())
            {
                using(var dbInitService = serviceScope.ServiceProvider.GetRequiredService<IDbInitService>())
                {
                    dbInitService.Initialize();
                }
            }
                return webApplication;
        }
    }
}
