using System.ComponentModel.DataAnnotations;

namespace API.AliMed.DTOs
{
    public record WizytaCreateRequest(
        [Required] DateTime DataWizyty,
        int? LekarzId,
        int? PlacowkaId,
        string? Diagnoza
    );
}
