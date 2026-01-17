using API.Alimed.Dtos;
using API.Alimed.Entities;

namespace API.Alimed.Interfaces
{
    public interface IUserService
    {
        Task<User> FindOrCreateUserByGithubIdAsync(string githubId, string githubLogin);
        Task AddRefreshTokenASync(Guid userId, string token);
        Task CreatePacjentForUserAsync(User user);
        Task CreatePacjentForLocalUserAsync(User user, string firstName, string lastName);
        Task<User?> FindByEmailAsync(string email);
        Task<User> CreateLocalUserAsync(string email, string username, string passwordHash, string salt);

        Task<Pacjent> CreatePacjentFromRegisterDtoAsync(User user, RegisterDto dto);

    }
}
