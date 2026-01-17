
using API.Alimed.Data;
using API.Alimed.Extensions;
using API.Alimed.Interfaces;
using API.Alimed.Services;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// mysql conn
var mysqlConn = builder.Configuration.GetConnectionString("MySqlConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(mysqlConn, ServerVersion.AutoDetect(mysqlConn)));

// Dodanie konfiguracji JWT
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddCustomServices(builder.Configuration);

builder.Services.AddAuthorization(); // auth attributes for endpoints
builder.Services.AddControllers(); // controller mapping
builder.Services.AddHttpClient(); // http
// builder.Services.AddOpenApi();



builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
if (builder.Environment.IsDevelopment() && (corsOrigins == null || corsOrigins.Length == 0))
{
    corsOrigins = new[] { "http://localhost:5173" };
}
if (!builder.Environment.IsDevelopment() && (corsOrigins == null || corsOrigins.Length == 0))
{
    throw new InvalidOperationException("CORS origins are not configured for production.");
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(corsOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // app.MapOpenApi();

    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "AliMed API v1");
        c.RoutePrefix = "swagger";
    });
}


// app.UseHttpsRedirection();
// CORS musi byc przed UseAuthentication
app.UseCors("AllowReactApp");


app.UseAuthentication();
app.UseAuthorization();

Console.WriteLine($"ENV: {app.Environment.EnvironmentName}");

app.MapControllers();
app.Run();

