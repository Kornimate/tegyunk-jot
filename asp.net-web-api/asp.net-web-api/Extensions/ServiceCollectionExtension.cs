using asp.net_web_api.Interfaces;
using asp.net_web_api.Services;

namespace asp.net_web_api.Extensions
{
    public static class ServiceCollectionExtension
    {
        public static IServiceCollection AddTransients(this IServiceCollection serviceProvider)
        {
            serviceProvider.AddTransient<IDbInitService, DbInitService>();
            return serviceProvider;
        }
    }
}
