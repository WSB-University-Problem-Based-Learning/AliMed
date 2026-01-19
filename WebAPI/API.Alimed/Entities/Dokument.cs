namespace API.Alimed.Entities
{
    public class Dokument
    {
        public int DokumentId { get; set; }

        public string? NazwaPliku { get; set; }
        public string TypDokumentu { get; set; } = string.Empty;
        public string? Opis { get; set; }
        public DateTime DataUtworzenia { get; set; } = DateTime.Now;

        public byte[]? Zawartosc { get; set; }
        public string? TypMime { get; set; }

        public int WizytaId { get; set; }
        public Wizyta? Wizyta { get; set; }

        public int PacjentId { get; set; }
        public Pacjent? Pacjent { get; set; }

        public int LekarzId { get; set; }
        public Lekarz? Lekarz { get; set; }
    }
}
