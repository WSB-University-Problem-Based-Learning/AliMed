using Microsoft.AspNetCore.Mvc;
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

        // github secrets
        // TODO - ustawic w env variable
        private const string GITHUB_CLIENT_ID = "";
        private const string GITHUB_CLIENT_SECRET = "";

        public AuthController(IHttpClientFactory httpClientFactory, IJwtService jwtService, IUserService userService)
        {
            _httpClientFactory = httpClientFactory;
            _jwtService = jwtService;
            _userService = userService;
        }

        public class GitHubCodeDto
        {
            public string Code { get; set; }
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
                    redirect_uri = ""
                };

                var tokenResponse = await httpClient.PostAsJsonAsync(tokenRequestUrl, tokenRequestBody);
                Console.WriteLine($"\n\"#########################################################\\");
                Console.Write(tokenRequestBody);
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

                var tokenContent = await tokenResponse.Content.ReadAsStringAsync();
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

                return Ok(new AuthResponseDto
                {
                    Token = jwtToken,
                    RefreshToken = refreshToken
                });

                //return Ok(new { Token = jwtToken });
            }
            catch (Exception ex)
            {
                // error logi status 505
                Console.WriteLine($"\n\"#########################################################\\");
                Console.WriteLine($"Api Error (Status 500)");
                Console.WriteLine($"Wyjatek Exception: {ex.GetType().Name}");
                Console.WriteLine($"Wiadomość catch Exception: {ex.Message}");
                Console.WriteLine($"\"#########################################################\\\n");
                return StatusCode(500, "Błąd serwera podczas przetwarzania logowania GitHub.");
            }
        }
    }
}
