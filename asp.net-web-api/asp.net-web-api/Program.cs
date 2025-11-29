
using asp.net_web_api.Extensions;
using asp.net_web_api.Models;
using asp.net_web_api.Users;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace asp.net_web_api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<PersistentDbContext>(options =>
            {
                options.UseSqlite(builder.Configuration.GetConnectionString("SQLiteDB"),
                                  options => options.MigrationsHistoryTable("__EFMigrationsHistory_PersContext")
                                                    .MigrationsAssembly(typeof(PersistentDbContext).Assembly.FullName));
                options.UseLazyLoadingProxies();
            });
            
            builder.Services.AddDbContext<TemporaryDbContext>(options =>
            {
                options.UseSqlite(builder.Configuration.GetConnectionString("TempSQLiteDB"),
                                  options => options.MigrationsHistoryTable("__EFMigrationsHistory_TempContext")
                                                    .MigrationsAssembly(typeof(TemporaryDbContext).Assembly.FullName));
                options.UseLazyLoadingProxies();
            });

            builder.Services.AddIdentity<AppUser, IdentityRole>()
                .AddEntityFrameworkStores<PersistentDbContext>()
                .AddDefaultTokenProviders();

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"]!,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        if (!string.IsNullOrEmpty(accessToken))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });

            // Extension methods in Extensions/ServiceCollectionExtensions
            builder.Services.AddTransients();
            builder.Services.AddSingletons();
            builder.Services.AddHostedServices();

            builder.Services.AddControllers();

            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.UseCors((builder) =>
            {
                builder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });

            app.UseDatabaseInitialization();

            app.Run();
        }
    }
}
