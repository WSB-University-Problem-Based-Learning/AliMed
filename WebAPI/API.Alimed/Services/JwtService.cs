using API.Alimed.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API.Alimed.Services
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _config;
        private readonly byte[] _key;

        public JwtService(IConfiguration config)
        {
            _config = config;
            // odczytanie klucza z appsettings i konwersja do tablicy bajtów
            _key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);
        }

        public string GenerateToken(string localUserId, string githubLogin, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenCredential = new SigningCredentials(
                    new SymmetricSecurityKey(_key),
                        SecurityAlgorithms.HmacSha256Signature
                        );
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                // tworzenie Claimów (oświadczeń) - info o userze, do zapisania w tokenie
                // new[] - inicjalizacja tablicy elementów typu Claim
                Subject = new ClaimsIdentity(new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, localUserId.ToString()),
                        new Claim(ClaimTypes.Name, githubLogin),
                        new Claim("github_login", githubLogin),
                        //new Claim("github_id", localUserId.ToString()),
                        new Claim("github_id", githubLogin),
                        new Claim(ClaimTypes.Role, role)
                    }),
                Expires = DateTime.UtcNow.AddMinutes(2), // Token ważny przez 2 minuty (testy)
                SigningCredentials = tokenCredential,// klucz do podpisania tokenu JWT (kryptografia symetryczna)
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"]
            };

            // utw tokenu z obiektu SecurityTokenDescriptor z Claimsa'mi
            var token = tokenHandler.CreateToken(tokenDescriptor);

            // obiekt JwtSecurityTokenHandler na string
            return tokenHandler.WriteToken(token);
        }

    }
}
