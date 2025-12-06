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
builder.Services.AddCustomServices(builder.Configuration);

builder.Services.AddAuthorization(); // auth attributes for endpoints
builder.Services.AddControllers(); // controller mapping
builder.Services.AddHttpClient(); // http
// builder.Services.AddOpenApi();


// cors policy for dev testing 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            //policy.WithOrigins("http://localhost:5173") // przepusc frontend z local dev
                policy.AllowAnyOrigin()                  // przepusc all origins - dla test w Docker
                      .AllowAnyHeader()                     // przepusc all nag³ówki (w tym Content-Type i Authorization)
                      .AllowAnyMethod();                    // dozwolone all requesty
        });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}


// app.UseHttpsRedirection();
// CORS
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
