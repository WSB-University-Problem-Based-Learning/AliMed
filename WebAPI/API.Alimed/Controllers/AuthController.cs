using API.Alimed.Data;
using API.Alimed.Interfaces;
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
        private readonly AppDbContext _db;

        private const string? GITHUB_CLIENT_ID = "Ov23liVc5BhNQu3ak43m";
        private const string? GITHUB_CLIENT_SECRET = "ce76eb423af872d4e710cdce762f55a7e6677714";

        public AuthController(IHttpClientFactory httpClientFactory, IJwtService jwtService, IUserService userService, IConfiguration configuration, AppDbContext db)
        {
            _httpClientFactory = httpClientFactory;
            _jwtService = jwtService;
            _userService = userService;
            _configuration = configuration;
            _db = db;


            // github secrets
            // TODO - ustawic w env variable
            //GITHUB_CLIENT_ID = _configuration["github:GITHUB_CLIENT_ID"];
            //GITHUB_CLIENT_SECRET = _configuration["github:GITHUB_CLIENT_SECRET"];
        }

        public class GitHubCodeDto
        {
            public string? Code { get; set; }
        }

        public class AuthResponseDto
        {
            public string Token { get; set; } = string.Empty;
            public string RefreshToken { get; set; } = string.Empty;
        }

        [HttpPost("github")] // url = /api/auth/github
        public async Task<IActionResult> GitHubLogin([FromBody] GitHubCodeDto payload)
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient();
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                // auth kod na token github
                var tokenRequestUrl = "https://github.com/login/oauth/access_token";
                var tokenRequestBody = new
                {
                    client_id = GITHUB_CLIENT_ID,
                    client_secret = GITHUB_CLIENT_SECRET,
                    code = payload.Code,
                    // adres z github redirectUrl [na frontend]
                    // npm run dev na: http://localhost:5173/auth/github/callback
                    // TODO - zmienic na ip/domene produkcji
                    redirect_uri = "http://localhost:5173/auth/github/callback"
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
                if(tokenContent.Contains("bad_verification_code"))
                {
                    return BadRequest("Kod logowania GitHub został już wykorzystany - specyfikacja OAuth 2.0");
                }

                var tokenData = JsonSerializer.Deserialize<Dictionary<string, string>>(tokenContent);
                var githubAccessToken = tokenData?["access_token"];

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

                // sprawdzenie i utw usera w bazie
                var localUser = await _userService.FindOrCreateUserByGithubIdAsync(githubId.ToString(), githubLogin);

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
                        Secure = false, // Ustaw na true w środowisku produkcyjnym
                        Expires = DateTimeOffset.UtcNow.AddDays(7),
                        SameSite = SameSiteMode.Strict
                    }
                );

                return Ok(new {token = jwtToken});


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
    
    
    }
}
