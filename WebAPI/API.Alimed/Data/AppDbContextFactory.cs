using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace API.Alimed.Data
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var environment =
                Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")
                ?? "Development";

            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", false)
                .AddJsonFile($"appsettings.{environment}.json", true)
                .Build();

            var connectionString =
                configuration.GetConnectionString("MySqlConnection");

            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();

            // Allow connection string also from environment variables (CI-friendly)
            var envConn = Environment.GetEnvironmentVariable("ConnectionStrings__MySqlConnection");
            var conn = !string.IsNullOrWhiteSpace(connectionString) ? connectionString : envConn;

            if (!string.IsNullOrWhiteSpace(conn))
            {
                try
                {
                    // Prefer AutoDetect when a valid connection string is available.
                    optionsBuilder.UseMySql(conn, ServerVersion.AutoDetect(conn));
                }
                catch
                {
                    // Fallback: explicit server version to avoid AutoDetect network probe failures
                    try
                    {
                        optionsBuilder.UseMySql(conn, new MySqlServerVersion(new Version(9, 5, 2)));
                    }
                    catch
                    {
                        // If even that fails (very unlikely), provide an in-memory DB so design-time
                        // tools can still create a DbContext without a remote DB.
                        optionsBuilder.UseInMemoryDatabase("DesignTimeDb");
                    }
                }
            }
            else
            {
                // No connection string: use in-memory DB for design-time scenarios.
                optionsBuilder.UseInMemoryDatabase("DesignTimeDb");
            }

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
