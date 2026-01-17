namespace API.Alimed.Dtos
{
    public class UpdatePacjentProfileDto
    {
        public string Imie { get; set; } = "";
        public string Nazwisko { get; set; } = "";
        public string Pesel { get; set; } = "";
        public DateTime DataUrodzenia { get; set; }

        public string Ulica { get; set; } = "";
        public string NumerDomu { get; set; } = "";
        public string KodPocztowy { get; set; } = "";
        public string Miasto { get; set; } = "";
        public string Kraj { get; set; } = "Polska";
    }
}
