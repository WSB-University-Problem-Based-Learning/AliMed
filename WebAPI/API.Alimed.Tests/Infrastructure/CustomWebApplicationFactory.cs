
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using API.Alimed.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.VisualStudio.TestPlatform.TestHost;
using System;
using System.IO;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Data.Sqlite;
using System.Data.Common;

namespace API.Alimed.Tests.Infrastructure;

public class CustomWebApplicationFactory
    : WebApplicationFactory<Program>
{
    public CustomWebApplicationFactory()
    {
        Environment.SetEnvironmentVariable("ConnectionStrings__MySqlConnection", "");
    }



    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        var baseDir = AppContext.BaseDirectory;
        var projectDir = new DirectoryInfo(baseDir);
        
        // Szukaj katalogu WebAPI lub AliMed (katalogu nadrzędnego projektów)
        while (projectDir != null && projectDir.Name != "WebAPI" && projectDir.Name != "AliMed")
        {
            projectDir = projectDir.Parent;
        }

        string? contentRoot = null;
        if (projectDir != null)
        {
            if (projectDir.Name == "WebAPI")
            {
                contentRoot = Path.Combine(projectDir.FullName, "API.Alimed");
            }
            else if (projectDir.Name == "AliMed")
            {
                contentRoot = Path.Combine(projectDir.FullName, "WebAPI", "API.Alimed");
            }
        }

        if (contentRoot == null || !Directory.Exists(contentRoot))
        {
            // Fallback do starej metody z poprawką na poziom zagłębienia
            contentRoot = Path.GetFullPath(Path.Combine(baseDir, "..", "..", "..", "..", "API.Alimed"));
        }

        builder.UseContentRoot(contentRoot);
        builder.ConfigureServices(services =>
        {
            // Usuń prawdziwą bazę
            var descriptors = services.Where(
                d => d.ServiceType == typeof(DbContextOptions<AppDbContext>) ||
                     d.ServiceType == typeof(DbContextOptions) ||
                     d.ServiceType == typeof(AppDbContext)).ToList();
            
            foreach (var d in descriptors)
            {
                services.Remove(d);
            }

            // SQLite InMemory persistent
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            services.AddSingleton<DbConnection>(connection);

            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlite(connection);
            });

            // Auth
            services.AddAuthentication("Test")
                .AddScheme<Microsoft.AspNetCore.Authentication.AuthenticationSchemeOptions, TestAuthHandler>(
                    "Test", _ => { });

            services.PostConfigure<AuthenticationOptions>(options => 
            {
                options.DefaultAuthenticateScheme = "Test";
                options.DefaultChallengeScheme = "Test";
            });

            var sp = services.BuildServiceProvider();

            using var scope = sp.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            db.Database.OpenConnection();
            db.Database.EnsureCreated();
        });

    }
}