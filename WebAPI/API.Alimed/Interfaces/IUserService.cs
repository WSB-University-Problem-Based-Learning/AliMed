using API.Alimed.Entities;

namespace API.Alimed.Interfaces
{
    public interface IUserService
    {
        Task<User> FindOrCreateUserByGithubIdAsync(string githubId, string githubLogin);
        Task AddRefreshTokenASync(Guid userId, string token);
        Task CreatePacjentForUserAsync(User user);
    }
}
