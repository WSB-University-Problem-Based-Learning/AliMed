namespace API.Alimed.Dtos
{
    public class RegisterDto
    {
        public string Email { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;

        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string Pesel { get; set; } = string.Empty;
        public DateTime DataUrodzenia { get; set; }

        // Adres
        public string Ulica { get; set; } = string.Empty;
        public string NumerDomu { get; set; } = string.Empty;
        public string KodPocztowy { get; set; } = string.Empty;
        public string Miasto { get; set; } = string.Empty;
        public string Kraj { get; set; } = "Polska";
    }
}
