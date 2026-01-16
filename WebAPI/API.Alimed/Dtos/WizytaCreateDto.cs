using System.ComponentModel.DataAnnotations;

namespace API.Alimed.Dtos
{
    public class WizytaCreateDto
    {
        [Required]
        public DateTime DataWizyty { get; set; }

        [Required]
        public int? LekarzId { get; set; }
        
        [Required]
        public int? PlacowkaId { get; set; }

        public string? Diagnoza { get; set; } // opcjonalnie
    }
}
