using System.ComponentModel.DataAnnotations.Schema;

namespace API.Alimed.Entities
{
    public class RefreshToken
    {
        public Guid Id { get; set; }
        public string? Token { get; set; } = string.Empty;
        public DateTime ExpiresOnUtc { get; set; }
        public bool IsRevoked { get; set; }


        // KLUCZ OBCY: Łączy ten token z użytkownikiem
        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
    }
}
