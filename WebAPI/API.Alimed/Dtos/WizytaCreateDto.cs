namespace API.Alimed.Dtos
{
    public class WizytaCreateDto
    {
        public DateTime DataWizyty { get; set; }
        public int? LekarzId { get; set; }
        public int? PlacowkaId { get; set; }
        public string? Diagnoza { get; set; } // opcjonalnie
    }
}
