using asp.net_web_api.Interfaces;
using asp.net_web_api.Services;
using ASP_Server.Services;

namespace asp.net_web_api.Extensions
{
    public static class ServiceCollectionExtension
    {
        public static IServiceCollection AddTransients(this IServiceCollection serviceProvider)
        {
            serviceProvider.AddTransient<IDbInitService, DbInitService>();
            serviceProvider.AddTransient<JwtService>();
            return serviceProvider;
        }
    }
}
