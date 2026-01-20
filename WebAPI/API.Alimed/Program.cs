
using API.Alimed.Data;
using API.Alimed.Extensions;
using API.Alimed.Interfaces;
using API.Alimed.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.RateLimiting;
// Avoid a direct compile-time dependency on Microsoft.OpenApi.Models
// because local IDE/package resolution may differ. We'll use reflection
// when registering OpenAPI security objects so the project builds
// even if the local OpenApi package resolution differs.


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// mysql conn
var mysqlConn = builder.Configuration.GetConnectionString("MySqlConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(mysqlConn, new MySqlServerVersion(new Version(8, 0, 0))));

// Dodanie konfiguracji JWT
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddCustomServices(builder.Configuration);

builder.Services.AddAuthorization(); // auth attributes for endpoints
builder.Services.AddControllers(); // controller mapping
builder.Services.AddHttpClient(); // http
// builder.Services.AddOpenApi();

builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("auth", limiterOptions =>
    {
        limiterOptions.PermitLimit = 5;
        limiterOptions.Window = TimeSpan.FromMinutes(1);
        limiterOptions.QueueLimit = 0;
    });
});


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // Use reflection to construct OpenApi types at runtime so the compiler
    // does not need to resolve Microsoft.OpenApi.Models at build-time.
    try
    {
        var asmName = "Microsoft.OpenApi";
        var schemeTypeName = "Microsoft.OpenApi.Models.OpenApiSecurityScheme, Microsoft.OpenApi";
        var requirementTypeName = "Microsoft.OpenApi.Models.OpenApiSecurityRequirement, Microsoft.OpenApi";
        var referenceTypeName = "Microsoft.OpenApi.Models.OpenApiReference, Microsoft.OpenApi";
        var referenceType = Type.GetType(referenceTypeName);
        var schemeType = Type.GetType(schemeTypeName);
        var requirementType = Type.GetType(requirementTypeName);

        if (schemeType != null)
        {
            var scheme = Activator.CreateInstance(schemeType);
            void Set(string prop, object val) => schemeType.GetProperty(prop)?.SetValue(scheme, val);

            Set("Name", "Authorization");
            // Set enum properties via their declaring types
            var secSchemeEnum = Type.GetType("Microsoft.OpenApi.Models.SecuritySchemeType, Microsoft.OpenApi");
            if (secSchemeEnum != null)
            {
                var httpVal = Enum.Parse(secSchemeEnum, "Http");
                Set("Type", httpVal);
            }
            Set("Scheme", "bearer");
            Set("BearerFormat", "JWT");
            var paramLocEnum = Type.GetType("Microsoft.OpenApi.Models.ParameterLocation, Microsoft.OpenApi");
            if (paramLocEnum != null)
            {
                var headerVal = Enum.Parse(paramLocEnum, "Header");
                Set("In", headerVal);
            }
            Set("Description", "Enter 'Bearer {token}'");

            // call c.AddSecurityDefinition("Bearer", scheme)
            var addDef = c.GetType().GetMethod("AddSecurityDefinition");
            addDef?.Invoke(c, new[] { (object)"Bearer", scheme });

            if (requirementType != null)
            {
                var requirement = Activator.CreateInstance(requirementType);
                // OpenApiSecurityRequirement is a Dictionary<OpenApiSecurityScheme, IList<string>>
                var addMethod = requirementType.GetMethod("Add", new[] { schemeType, typeof(IEnumerable<string>) });
                if (addMethod != null)
                {
                    addMethod.Invoke(requirement, new object[] { scheme, new string[0] });
                    var addReq = c.GetType().GetMethod("AddSecurityRequirement");
                    addReq?.Invoke(c, new[] { requirement });
                }
            }
        }
    }
    catch
    {
        // If reflection fails, let Swagger run without the security definition.
    }
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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseCors("AllowReactApp");
    // app.MapOpenApi();

    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "AliMed API v1");
        c.RoutePrefix = "swagger";
    });
}

// NOTE: Swagger UI is enabled above only in Development environment.
// To enable Swagger in Production temporarily or permanently, uncomment one
// of the blocks below and redeploy/restart the application. Keep in mind
// exposing Swagger in public production is a security consideration.

// Option A: Enable only when a specific environment variable is set (safer)
// if (Environment.GetEnvironmentVariable("ENABLE_SWAGGER_IN_PROD") == "true")
// {
//     app.UseSwagger();
//     app.UseSwaggerUI(c =>
//     {
//         c.SwaggerEndpoint("/swagger/v1/swagger.json", "AliMed API v1");
//         c.RoutePrefix = "swagger";
//     });
// }

// Option B: Always enable Swagger (not recommended for public prod)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "AliMed API v1");
    c.RoutePrefix = "swagger";
});
 
// app.UseHttpsRedirection();
// CORS musi byc przed UseAuthentication bo sra bledami
app.UseCors("AllowReactApp");

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

Console.WriteLine($"ENV: {app.Environment.EnvironmentName}");

app.MapControllers();
app.Run();
