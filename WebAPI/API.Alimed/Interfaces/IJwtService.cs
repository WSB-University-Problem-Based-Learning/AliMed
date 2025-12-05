namespace API.Alimed.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(string localUserId, string githubLogin, string role);
    }
}
