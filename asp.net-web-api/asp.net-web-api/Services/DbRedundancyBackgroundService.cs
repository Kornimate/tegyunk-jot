

using asp.net_web_api.Interfaces;

namespace asp.net_web_api.Services
{
    public class DbRedundancyBackgroundService : BackgroundService
    {
        private IDbBackupService _backupService;
        private ITemporaryDbCleaningService _dbCleaningService;
        private DateTime _lastBackup = DateTime.MinValue;

        public DbRedundancyBackgroundService(IDbBackupService backupService, ITemporaryDbCleaningService dbCleaningService)
        {
            _backupService = backupService;
            _dbCleaningService = dbCleaningService;
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

                        await _dbCleaningService.RemoveOlderThan12DaysElements();

                        _lastBackup = today;
                    }
                }
                catch (Exception) { }

                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }
        }
    }
}
