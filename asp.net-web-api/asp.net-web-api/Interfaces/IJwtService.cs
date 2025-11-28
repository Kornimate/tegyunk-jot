using asp.net_web_api.Users;

namespace asp.net_web_api.Interfaces
{
    public interface IJwtService
    {
        string GenerateJwtToken(AppUser user);
    }
}
