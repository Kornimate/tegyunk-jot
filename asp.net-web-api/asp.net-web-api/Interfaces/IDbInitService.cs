namespace asp.net_web_api.Interfaces
{
    public interface IDbInitService : IDisposable
    {
        bool Initialize();
    }
}
