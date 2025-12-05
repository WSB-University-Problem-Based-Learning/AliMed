using API.Alimed.Enums;

namespace API.Alimed.Entities
{
    public class User
    {
        public Guid UserId { get; set; }
        public string? GithubId { get; set; }
        public string? GithubName { get; set; }
        public string? Username { get; set; }
        public string? Token { get; set; }
        public UserRole Role { get; set; } = UserRole.User;
        public ICollection<RefreshToken>? RefreshTokens { get; set; } = new List<RefreshToken>();

        public Pacjent? Pacjent { get; set; } //opcjonalne latwiej sie czyta

    }
}
