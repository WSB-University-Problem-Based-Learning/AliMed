using System.ComponentModel.DataAnnotations;

namespace API.Alimed.Dtos
{
    public class DokumentUpdateDto
    {
        [Required]
        public string TypDokumentu { get; set; } = string.Empty;

        public string? NazwaPliku { get; set; }
        public string? Opis { get; set; }
        public string? Tresc { get; set; }
    }
}
