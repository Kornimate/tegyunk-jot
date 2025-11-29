namespace asp.net_web_api.Interfaces
{
    public interface ITemporaryDbCleaningService
    {
        Task<bool> RemoveOlderThan12DaysElements();
    }
}
