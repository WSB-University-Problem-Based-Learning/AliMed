using API.Alimed.Data;
using API.Alimed.Dtos;
using API.Alimed.Interfaces;
using API.Alimed.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text.Json;

namespace API.Alimed.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IJwtService _jwtService;
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;
        private readonly IPasswordService _passwordService;
        private readonly AppDbContext _db;

        private readonly string? _githubClientId;
        private readonly string? _githubClientSecret;

        public AuthController(IHttpClientFactory httpClientFactory, IJwtService jwtService, IUserService userService, IConfiguration configuration, AppDbContext db, IPasswordService passwordService)
        {
            _httpClientFactory = httpClientFactory;
            _jwtService = jwtService;
            _userService = userService;
            _configuration = configuration;
            _db = db;
            _passwordService = passwordService;

            // GitHub secrets from configuration or environment
            _githubClientId = _configuration["GitHub:ClientId"] ?? Environment.GetEnvironmentVariable("GITHUB_CLIENT_ID");
            _githubClientSecret = _configuration["GitHub:ClientSecret"] ?? Environment.GetEnvironmentVariable("GITHUB_CLIENT_SECRET");
        }



        [HttpPost("github")] // url = /api/auth/github
        public async Task<IActionResult> GitHubLogin([FromBody] GithubCodeDto payload)
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient();
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                // auth kod na token github
                var tokenRequestUrl = "https://github.com/login/oauth/access_token";
                if (string.IsNullOrWhiteSpace(_githubClientId) || string.IsNullOrWhiteSpace(_githubClientSecret))
                {
                    return StatusCode(500, "GitHub OAuth not configured: missing ClientId/ClientSecret");
                }

                var tokenRequestBody = new
                {
                    client_id = _githubClientId,
                    client_secret = _githubClientSecret,
                    code = payload.Code,
                    // adres z github redirectUrl [na frontend]
                    redirect_uri = "https://alimed.com.pl/auth/github/callback"
                };

                var tokenResponse = await httpClient.PostAsJsonAsync(tokenRequestUrl, tokenRequestBody);
                Console.WriteLine($"\n\"#########################################################\\");
                Console.Write($"Token req body: {tokenRequestBody}");
                Console.WriteLine($"\n\"#########################################################\\");

                if (!tokenResponse.IsSuccessStatusCode)
                {
                    var errorContent = await tokenResponse.Content.ReadAsStringAsync();

                    // errors
                    Console.WriteLine($"\n\"#########################################################\\");
                    Console.WriteLine($"Zwrotka z GITHUB (StatusCode: {tokenResponse.StatusCode})");
                    Console.WriteLine($"Wysłany kod autoryzacji: {payload.Code}");
                    Console.WriteLine($"Error tresc GitHub: {errorContent}");
                    Console.WriteLine($"#########################################################\n");

                    // error do frontendu 401/400
                    return StatusCode((int)tokenResponse.StatusCode, $"Nieudana wymiana kodu GitHub. Specs: {errorContent}");
                }
                // =========================================================================

                // sprawdzenie czy Kod Logowania Github Już użyto (1 na minute?)
                var tokenContent = await tokenResponse.Content.ReadAsStringAsync();
                //if(tokenContent.Contains("bad_verification_code"))
                //{
                //    return BadRequest("Kod logowania GitHub został już wykorzystany - specyfikacja OAuth 2.0");
                //}

                var tokenJson = JsonSerializer.Deserialize<Dictionary<string, object>>(tokenContent);

                if (tokenJson.ContainsKey("error"))
                {
                    var err = tokenJson["error"]?.ToString();
                    return BadRequest($"GitHub OAuth error: {err}");
                }

                if (!tokenJson.ContainsKey("access_token"))
                {
                    return BadRequest("GitHub nie zwrócił access_token.");
                }


                var tokenData = JsonSerializer.Deserialize<Dictionary<string, string>>(tokenContent);
                var githubAccessToken = tokenData?["access_token"]!.ToString();

                if (string.IsNullOrEmpty(githubAccessToken))
                {
                    Console.WriteLine("Błąd Github Sukces ale Token Pusty");
                    return BadRequest("Nie udało się uzyskać tokena dostępu GitHub.");
                }

                // pobranie user info z github
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("token", githubAccessToken);
                httpClient.DefaultRequestHeaders.Add("User-Agent", "DotNetAuthApp"); // GitHub wymaga User-Agent dla zapytań API

                // musi byc typ JsonElement
                var userResponse = await httpClient.GetFromJsonAsync<JsonElement>("https://api.github.com/user");

                // pobranie github id i login
                var githubId = userResponse.GetProperty("id").GetInt32();
                var githubLogin = userResponse.GetProperty("login").GetString();

                Console.WriteLine($"GitHub ID: {githubId}");
                Console.WriteLine($"GitHub Login: {githubLogin}");

                // sprawdzenie i utw usera w bazie
                var localUser = await _userService

                    .FindOrCreateUserByGithubIdAsync(githubId.ToString(), githubLogin);

                // JWT local Token
                // var jwtToken = _jwtService.GenerateToken(githubId, githubLogin);
                var jwtToken = _jwtService.GenerateToken(
                    localUser.UserId.ToString(),
                    localUser.GithubName,
                    localUser.Role.ToString()
                    );

                string refreshToken = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString();
                await _userService.AddRefreshTokenASync(localUser.UserId, refreshToken);

                Response.Cookies.Append(
                    "refresh_token",
                    refreshToken,
                    new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true, // HTTPS w produkcji
                        Expires = DateTimeOffset.UtcNow.AddDays(7),
                        SameSite = SameSiteMode.None // Dla cross-origin
                    }
                );

                return Ok(new {token = jwtToken, refreshToken = refreshToken});


            }
            catch (Exception ex)
            {

                // nowe errory
                Console.WriteLine("Api Error (Status 500");
                Console.WriteLine($"Wyjatek Exception: {ex.GetType().Name}");
                Console.WriteLine($"Msg catch Exception: {ex.Message}");

                if(ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.GetType().Name}");
                    Console.WriteLine($"Inner Msg Exception: {ex.InnerException.Message}");
                }

                // error logi status 505
                Console.WriteLine($"\n\"#########################################################\\");
                Console.WriteLine($"Api Error (Status 500)");
                Console.WriteLine($"Wyjatek Exception: {ex.GetType().Name}");
                Console.WriteLine($"Wiadomość catch Exception: {ex.Message}");
                Console.WriteLine($"\"#########################################################\\\n");
                return StatusCode(500, "Błąd serwera podczas przetwarzania logowania GitHub.");
            }
        }


        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refresh_token"];

            if(string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized("Brak refresh tokenu");
            }

            var tokenInDb = await _db.RefreshToken
                .FirstOrDefaultAsync(t => t.Token == refreshToken);

            if (tokenInDb == null || tokenInDb.IsRevoked || tokenInDb.ExpiresOnUtc < DateTime.UtcNow)
                return Unauthorized("Refresh token wygasł lub jest nieważny.");

            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.UserId == tokenInDb!.UserId);

            if (user == null)
            {
                Unauthorized("User nie istnieje");
            }
            // nowy access token
            var newAccessToken = _jwtService.GenerateToken(
                user!.UserId.ToString(),
                user.GithubName!,
                user.Role.ToString()
                );
        
            tokenInDb.ExpiresOnUtc = DateTime.UtcNow.AddDays(7);
            await _db.SaveChangesAsync();

            return Ok(new {accessToken = newAccessToken});

        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            // Czy email istnieje?
            var existing = await _userService.FindByEmailAsync(dto.Email);
            if (existing != null)
                return BadRequest("Email jest już zajęty.");

            // Hashujemy hasło
            var (hash, salt) = _passwordService
                .HashPassword(dto.Password);

            // Tworzymy usera + pacjenta
            var user = await _userService
                .CreateLocalUserAsync(dto.Email, dto.Username, hash, salt);

            // 🔥 Teraz tworzymy pacjenta na podstawie danych z rejestracji
            await _userService.CreatePacjentFromRegisterDtoAsync(user, dto);

            // Tworzymy access token
            var jwtToken = _jwtService.GenerateToken(
                user.UserId.ToString(),
                user.Username,
                user.Role.ToString()
            );

            // Refresh token
            string refreshToken = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString();
            await _userService.AddRefreshTokenASync(user.UserId, refreshToken);

            Response.Cookies.Append("refresh_token", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new { token = jwtToken, refreshToken = refreshToken });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userService.FindByEmailAsync(dto.Email);

            if (user == null || user.PasswordHash == null || user.PasswordSalt == null)
                return Unauthorized("Niepoprawny email lub hasło.");

            if (!_passwordService.Verify(dto.Password, user.PasswordHash, user.PasswordSalt))
                return Unauthorized("Niepoprawny email lub hasło.");

            var jwtToken = _jwtService.GenerateToken(
                user.UserId.ToString(),
                user.Username,
                user.Role.ToString()
            );

            string refreshToken = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString();
            await _userService.AddRefreshTokenASync(user.UserId, refreshToken);

            Response.Cookies.Append("refresh_token", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new { token = jwtToken, refreshToken = refreshToken });
        }


        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refresh_token"];

            if (!string.IsNullOrEmpty(refreshToken))
            {
                var token = await _db.RefreshToken.FirstOrDefaultAsync(t => t.Token == refreshToken);
                if (token != null)
                {
                    token.IsRevoked = true;
                    await _db.SaveChangesAsync();
                }
            }

            // usuń cookie
            Response.Cookies.Append("refresh_token", "", new CookieOptions
            {
                Expires = DateTime.UtcNow.AddDays(-1),
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Strict
            });

            return Ok(new { message = "Wylogowano." });
        }
    }
}
