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
                .FirstOrDefaultAsync(u => u.GithubId == githubId);

            if (user != null)
            {
                return user;
            }
            // jeśli nie istnieje, tworzy nowego użytkownika
            user = new User
            {
                UserId = Guid.NewGuid(),
                GithubId = githubId,
                GithubName = githubLogin,
                Username = githubLogin, // lub inna logika nadawania nazwy użytkownika
                Role = UserRole.User // domyślna rola
            };

            // insert nowego użytkownika do bazy danych
            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            // zwrot nowo utworzonego użytkownika
            return user;
        }

        public async Task AddRefreshTokenASync(Guid userId, string token)
        {
            var refreshToken = new RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Token = token,
                ExpiresOnUtc = DateTime.UtcNow.AddMinutes(3) // przykładowy czas wygaśnięcia
            };

            _db.RefreshToken.Add(refreshToken);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateUserRoleAsync(Guid userId, UserRole newRole)
        {

        }
    }
}
