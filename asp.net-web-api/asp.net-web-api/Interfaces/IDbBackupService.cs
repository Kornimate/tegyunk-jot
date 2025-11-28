namespace asp.net_web_api.Interfaces
{
    public interface IDbBackupService
    {
        Task<bool> SaveToDisk();

        Task RemoveOldBackups();
    }
}
