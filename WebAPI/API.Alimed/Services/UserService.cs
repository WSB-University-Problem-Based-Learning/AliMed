using API.Alimed.Data;
using API.Alimed.Entities;
using API.Alimed.Enums;
using API.Alimed.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Alimed.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _db;
        public UserService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<User> FindOrCreateUserByGithubIdAsync(string githubId, string githubLogin)
        {
            // szuka użytkownika po githubId czy istnieje w db
            var user = await _db.Users
                .Include(u => u.Pacjent)
                .FirstOrDefaultAsync(u => u.GithubId == githubId);

            if (user != null)
            {
                if(user.Pacjent == null)
                {
                    await CreatePacjentForUserAsync(user);
                }

                return user;
            }

            // if nie istnieje tworzy nowego użytkownika
            user = new User
            {
                UserId = Guid.NewGuid(),
                GithubId = githubId,
                GithubName = githubLogin,
                Username = githubLogin, 
                Role = UserRole.User // default rola
            };


            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            // utw pacjenta na podstawie zalogowanego usera
            // TODO poprawic walidacje 
            await CreatePacjentForUserAsync(user);

            return user;
        }

        public async Task AddRefreshTokenASync(Guid userId, string token)
        {
            var refreshToken = new RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Token = token,
                ExpiresOnUtc = DateTime.UtcNow.AddMinutes(3) // czas trwania ref tkn
            };

            _db.RefreshToken.Add(refreshToken);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateUserRoleAsync(Guid userId, UserRole newRole)
        {

        }

        public async Task CreatePacjentForUserAsync(User user)
        {
            var pacjent = new Pacjent
            {
                Imie = user.GithubName ?? "Użytkownik",
                Nazwisko = "GitHub",
                Pesel = Guid.NewGuid().ToString().Substring(0, 11),
                DataUrodzenia = DateTime.UtcNow.AddYears(-25),
                UserId = user.UserId,
                AdresZamieszkania = new Adres
                {
                    Ulica = "Nieznana",
                    NumerDomu = "1",
                    KodPocztowy = "00-001",
                    Miasto = "Warszawa",
                    Kraj = "Polska"
                }
            };

            _db.Pacjenci.Add(pacjent);
            await _db.SaveChangesAsync();
        }





    }
}
