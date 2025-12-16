namespace API.AliMed.Entities
{
    public enum UserRole
    {
        User = 0,
        Lekarz = 1,
        Admin = 2
    }

    public class UserAccount
    {
        [System.ComponentModel.DataAnnotations.Key]
        public string UserId { get; set; } = Guid.NewGuid().ToString();

        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        public UserRole Role { get; set; } = UserRole.User;

        // opcjonalne powiazanie z pacjentem/lekarzem
        public int? PacjentId { get; set; }
        public Pacjent? Pacjent { get; set; }

        public int? LekarzId { get; set; }
        public Lekarz? Lekarz { get; set; }
    }
}
