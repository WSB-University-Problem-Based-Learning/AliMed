using System.ComponentModel.DataAnnotations;

namespace API.Alimed.Dtos
{
    public class DokumentCreateDto
    {
        [Required]
        public int WizytaId { get; set; }

        [Required]
        public string TypDokumentu { get; set; } = string.Empty;

        public string? NazwaPliku { get; set; }
        public string? Opis { get; set; }
        public string? Tresc { get; set; }
    }
}
