using API.AliMed.Data;
using API.AliMed.DTOs;
using API.AliMed.Entities;
using API.AliMed.Services;
using Microsoft.EntityFrameworkCore;

namespace API.AliMed.Endpoints
{
    public static class AuthEndpoints
    {
        public static void MapAuthEndpoints(IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/auth");

            group.MapPost("/register", Register);
            group.MapPost("/login", Login);
            group.MapPost("/github", GitHubLogin);
            group.MapPost("/refresh", RefreshToken);
        }

        private static async Task<IResult> Register(RegisterRequest request, AppDbContext db)
        {
            if (await db.Uzytkownicy.AnyAsync(u => u.Email == request.Email))
            {
                return Results.BadRequest("Użytkownik z takim adresem email już istnieje.");
            }

            var hashedPassword = PasswordHasher.Hash(request.Password);

            var pacjent = new Pacjent
            {
                Imie = request.FirstName,
                Nazwisko = request.LastName,
                Pesel = string.IsNullOrWhiteSpace(request.Pesel) ? Guid.NewGuid().ToString()[..11] : request.Pesel,
                DataUrodzenia = ParseDate(request.DataUrodzenia) ?? DateTime.UtcNow.AddYears(-25),
                AdresZamieszkania = new Adres
                {
                    Ulica = request.Ulica,
                    NumerDomu = request.NumerDomu,
                    KodPocztowy = request.KodPocztowy,
                    Miasto = request.Miasto,
                    Kraj = string.IsNullOrWhiteSpace(request.Kraj) ? "Polska" : request.Kraj
                }
            };

            var user = new UserAccount
            {
                Email = request.Email,
                Username = request.Username,
                FirstName = request.FirstName,
                LastName = request.LastName,
                PasswordHash = hashedPassword,
                Role = UserRole.User,
                Pacjent = pacjent
            };

            pacjent.UserId = user.UserId;

            db.Uzytkownicy.Add(user);
            await db.SaveChangesAsync();

            var token = GenerateToken();
            return Results.Ok(new AuthResponse(token, GenerateRefreshToken(), ToDto(user)));
        }

        private static async Task<IResult> Login(LoginRequest request, AppDbContext db)
        {
            var user = await db.Uzytkownicy.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user is null || !PasswordHasher.Verify(request.Password, user.PasswordHash))
            {
                return Results.BadRequest("Niepoprawny email lub hasło.");
            }

            var token = GenerateToken();
            return Results.Ok(new AuthResponse(token, GenerateRefreshToken(), ToDto(user)));
        }

        private static async Task<IResult> GitHubLogin(Dictionary<string, string> body, AppDbContext db)
        {
            // w wersji demo nie łączymy się z GitHubem, generujemy konto tymczasowe
            var email = body.ContainsKey("code") ? $"github-{body["code"]}@example.com" : $"github-{Guid.NewGuid()}@example.com";

            var existing = await db.Uzytkownicy.FirstOrDefaultAsync(u => u.Email == email);
            if (existing is null)
            {
                existing = new UserAccount
                {
                    Email = email,
                    Username = "github-user",
                    PasswordHash = PasswordHasher.Hash(Guid.NewGuid().ToString()),
                    Role = UserRole.User,
                    FirstName = "GitHub",
                    LastName = "User"
                };

                db.Uzytkownicy.Add(existing);
                await db.SaveChangesAsync();
            }

            var token = GenerateToken();
            return Results.Ok(new AuthResponse(token, GenerateRefreshToken(), ToDto(existing)));
        }

        private static Task<IResult> RefreshToken()
        {
            var token = GenerateToken();
            return Task.FromResult<IResult>(Results.Ok(new { accessToken = token }));
        }

        private static string GenerateToken() => Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        private static string GenerateRefreshToken() => Convert.ToBase64String(Guid.NewGuid().ToByteArray());

        private static UserDto ToDto(UserAccount user) => new(
            user.UserId,
            user.Email,
            user.FirstName,
            user.LastName,
            user.Role);

        private static DateTime? ParseDate(string? input)
        {
            if (string.IsNullOrWhiteSpace(input)) return null;
            return DateTime.TryParse(input, out var parsed) ? parsed : null;
        }
    }
}
