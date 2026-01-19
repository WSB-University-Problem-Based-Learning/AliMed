using System.ComponentModel.DataAnnotations;

namespace API.Alimed.Dtos
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        [MaxLength(256)]
        public string Email { get; set; } = null!;

        [Required]
        [MinLength(3)]
        [MaxLength(64)]
        public string Username { get; set; } = null!;

        [Required]
        [MinLength(8)]
        [MaxLength(128)]
        public string Password { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [MinLength(11)]
        [MaxLength(11)]
        public string Pesel { get; set; } = string.Empty;

        [Required]
        public DateTime DataUrodzenia { get; set; }

        // Adres
        [Required]
        [MaxLength(100)]
        public string Ulica { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string NumerDomu { get; set; } = string.Empty;

        [Required]
        [MaxLength(10)]
        public string KodPocztowy { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Miasto { get; set; } = string.Empty;

        [MaxLength(60)]
        public string Kraj { get; set; } = "Polska";
    }
}
