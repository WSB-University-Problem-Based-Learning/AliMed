using System.ComponentModel.DataAnnotations;

namespace API.Alimed.Dtos
{
    public class AdminPromoteToDoctorDto
    {
        [Required]
        public string Specjalizacja { get; set; } = string.Empty;

        [Required]
        public int PlacowkaId { get; set; }
    }
}
