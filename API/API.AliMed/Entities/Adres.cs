namespace API.AliMed.Entities
{
    public class Adres
    {
        public string? Ulica { get; set; }
        public string? NumerDomu { get; set; }
        public string? NumerMieszkania { get; set; }
        public string? KodPocztowy { get; set; }
        public string? Miasto { get; set; }
        public string Kraj { get; set; } = "Polska"; // default val
    }
}
