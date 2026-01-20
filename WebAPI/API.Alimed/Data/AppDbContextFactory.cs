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
            // During design-time (ef migrations bundle) ServerVersion.AutoDetect may attempt
            // to connect to the database which is not always possible from CI/build agents.
            // Use an explicit server version here to allow design-time tools to run without
            // contacting the DB. Revert to AutoDetect after bundle creation if desired.
            optionsBuilder.UseMySql(
                connectionString,
                new MySqlServerVersion(new Version(9,5,2))
            );

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
