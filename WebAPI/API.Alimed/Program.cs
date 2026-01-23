
using API.Alimed.Data;
using API.Alimed.Extensions;
using API.Alimed.Interfaces;
using API.Alimed.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.OpenApi.Models;
using System.Globalization;
using System.Threading.RateLimiting;

//trigger gh actions by olek
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// mysql conn
var mysqlConn = builder.Configuration.GetConnectionString("MySqlConnection");
if (!string.IsNullOrEmpty(mysqlConn))
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseMySql(mysqlConn, new MySqlServerVersion(new Version(8, 0, 0))));
}

// Dodanie konfiguracji JWT
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddCustomServices(builder.Configuration);

builder.Services.AddAuthorization(); // auth attributes for endpoints
builder.Services.AddControllers(); // controller mapping
builder.Services.AddHttpClient(); // http


builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, token) =>
    {
        int? retryAfterSeconds = null;
        if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
        {
            retryAfterSeconds = (int)Math.Ceiling(retryAfter.TotalSeconds);
            context.HttpContext.Response.Headers.RetryAfter =
                retryAfterSeconds.Value.ToString(CultureInfo.InvariantCulture);
        }

        var message = retryAfterSeconds.HasValue
            ? $"Za duzo prob. Sprobuj ponownie za {retryAfterSeconds.Value} s."
            : "Za duzo prob. Sprobuj ponownie pozniej.";

        context.HttpContext.Response.ContentType = "application/json";
        await context.HttpContext.Response.WriteAsJsonAsync(
            new { error = message, retryAfterSeconds },
            cancellationToken: token);
    };

    options.AddFixedWindowLimiter("auth_login", limiterOptions =>
    {
        limiterOptions.PermitLimit = 20;
        limiterOptions.Window = TimeSpan.FromMinutes(1);
        limiterOptions.QueueLimit = 0;
    });
    options.AddFixedWindowLimiter("auth_refresh", limiterOptions =>
    {
        limiterOptions.PermitLimit = 60;
        limiterOptions.Window = TimeSpan.FromMinutes(1);
        limiterOptions.QueueLimit = 0;
    });
});


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "AliMed API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});


// cors policy for dev testing 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins(
                    "http://localhost:5173",
                    "https://alimed.com.pl",
                    "https://www.alimed.com.pl",
                    "http://alimed.com.pl",
                    "http://www.alimed.com.pl"
                )
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});




var app = builder.Build();

// Enable Swagger
app.UseSwagger(c =>
{
    c.RouteTemplate = "swagger/{documentName}/swagger.json";
});
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "AliMed API v1");
    c.RoutePrefix = "swagger";
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseCors("AllowReactApp");
}
 

// CORS musi byc przed UseAuthentication bo sra bledami
app.UseCors("AllowReactApp");

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

Console.WriteLine($"ENV: {app.Environment.EnvironmentName}");

app.MapControllers();
app.Run();


public partial class Program { }
