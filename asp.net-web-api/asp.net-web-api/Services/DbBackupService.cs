using asp.net_web_api.Interfaces;
using Microsoft.Data.Sqlite;

namespace asp.net_web_api.Services
{
    public class DbBackupService : IDbBackupService
    {
        private readonly IConfiguration _config;
        private readonly IHostEnvironment _env;
        private static readonly string BACKUP_PATH = "Backups";
        public DbBackupService(IConfiguration config, IHostEnvironment env)
        {
            _config = config;
            _env = env;
        }
        public Task RemoveOldBackups()
        {
            FileInfo[] backupFiles = new DirectoryInfo(Path.Combine(_env.ContentRootPath,BACKUP_PATH)).GetFiles();

            foreach (FileInfo backupFile in backupFiles)
            {
                if(backupFile.Exists && (backupFile.CreationTimeUtc - DateTime.UtcNow) > TimeSpan.FromDays(4))
                {
                    try
                    {
                        backupFile.Delete();
                    }
                    catch (Exception){ }
                }
            }

            return Task.CompletedTask;
        }

        public Task<bool> SaveToDisk()
        {
            try
            {
                string backUpName = Path.Combine(BACKUP_PATH, $"backup_{ DateTime.UtcNow:yyyy_MM_dd}.db");

                EnsureBackUpCreated(backUpName);

                using var activeDbConnection = new SqliteConnection(_config.GetConnectionString("SQLiteDB"));
                using var backupDBConnection = new SqliteConnection($"Data Source={backUpName}");

                activeDbConnection.Open();
                backupDBConnection.Open();

                activeDbConnection.BackupDatabase(backupDBConnection);

                return Task.FromResult(true);
            }
            catch (Exception)
            {
                return Task.FromResult(false);
            }
        }

        private void EnsureBackUpCreated(string backUpName)
        {
            string path = Path.Combine(_env.ContentRootPath, backUpName);

            DirectoryInfo parentDirInfo = Directory.GetParent(path)!;

            if (parentDirInfo?.Exists == false)
            {
                parentDirInfo.Create();
            }

            if (!File.Exists(path))
            {
                using var fs = File.Create(path);
            }
        }
    }
}
