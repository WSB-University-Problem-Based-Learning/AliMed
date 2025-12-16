using API.AliMed.Data;
using API.AliMed.Endpoints;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => policy
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
        .WithOrigins("http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"));
});

var mysqlConn = builder.Configuration.GetConnectionString("MySqlConnection");
var useInMemory = builder.Configuration.GetValue("UseInMemoryDatabase", false);

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (useInMemory || string.IsNullOrWhiteSpace(mysqlConn))
    {
        options.UseInMemoryDatabase("AliMedDemoDb");
    }
    else
    {
        options.UseMySql(mysqlConn, ServerVersion.AutoDetect(mysqlConn));
    }
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await DataSeeder.SeedAsync(db);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
AuthEndpoints.MapAuthEndpoints(app);
PacjenciEndpoints.MapPacjenciEndpoints(app);
LekarzeEndpoints.MapLekarzeEndpoints(app);
WizytyEndpoints.MapWizytyEndpoints(app);
DokumentyEndpoints.MapDokumentyEndpoints(app);

app.MapGet("/health", () => Results.Ok(new { status = "ok", timestamp = DateTime.UtcNow }));

await app.RunAsync();
