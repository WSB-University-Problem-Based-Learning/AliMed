namespace API.AliMed.Entities
{
    public class Dokument
    {
        public int DokumentId { get; set; }
        public string? NazwaPliku { get; set; }
        public string? TypDokumentu { get; set; }
        public string? Opis { get; set; }
        public DateTime DataUtworzenia { get; set; } = DateTime.UtcNow;
        public long RozmiarPliku { get; set; }

        public int? WizytaId { get; set; }
        public Wizyta? Wizyta { get; set; }

        public int? PacjentId { get; set; }
        public Pacjent? Pacjent { get; set; }

        // dane binarne dokumentu (np. pdf)
        public byte[]? ZawartoscPliku { get; set; }
    }
}
