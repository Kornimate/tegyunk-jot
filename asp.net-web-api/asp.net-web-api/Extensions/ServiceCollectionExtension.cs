using asp.net_web_api.Interfaces;
using asp.net_web_api.Services;
using ASP_Server.Services;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace asp.net_web_api.Extensions
{
    public static class ServiceCollectionExtension
    {
        public static IServiceCollection AddTransients(this IServiceCollection serviceProvider)
        {
            serviceProvider.AddTransient<IDbInitService, DbInitService>();
            serviceProvider.AddTransient<IEmailService, EmailService>();
            serviceProvider.AddTransient<IEmailSender, EmailSender>();
            serviceProvider.AddTransient<IJwtService, JwtService>();

            return serviceProvider;
        }

        public static IServiceCollection AddSingletons(this IServiceCollection serviceProvider)
        {
            serviceProvider.AddSingleton<IDbBackupService, DbBackupService>();

            return serviceProvider;
        }

        public static IServiceCollection AddHostedServices(this IServiceCollection serviceProvider)
        {
            serviceProvider.AddHostedService<DbRedundancyService>();

            return serviceProvider;
        }
    }
}
