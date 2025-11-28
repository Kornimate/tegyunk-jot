

using asp.net_web_api.Interfaces;

namespace asp.net_web_api.Services
{
    public class DbRedundancyService : BackgroundService
    {
        private IDbBackupService _backupService;
        private DateTime _lastBackup = DateTime.MinValue;

        public DbRedundancyService(IDbBackupService backupService)
        {
            _backupService = backupService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    DateTime today = DateTime.Today;

                    if (_lastBackup < today && DateTime.UtcNow.Hour >= 2)
                    {
                        await _backupService.SaveToDisk();
                        await _backupService.RemoveOldBackups();

                        _lastBackup = today;
                    }
                }
                catch (Exception) { }

                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }
        }
    }
}
