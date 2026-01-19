using API.Alimed.Enums;

namespace API.Alimed.Entities
{
    public class Wizyta
    {
        public int WizytaId { get; set; }
        public DateTime DataWizyty { get; set; }
        public string? Diagnoza { get; set; }

        // status wizyty ENUM zamiast bool CzyOdbyta
        public StatusWizyty Status { get; set; } = StatusWizyty.Zaplanowana;

        // --- Relacje i klucze obce (FK) ---
        // foreign key do Pacjenta
        public int? PacjentId { get; set; }
        public Pacjent? Pacjent { get; set; }

        // foreign key do Lekarza
        public int? LekarzId { get; set; }
        public Lekarz? Lekarz { get; set; }

        // foreign key do Placowki
        public int? PlacowkaId { get; set; }
        public Placowka? Placowka { get; set; }

        public ICollection<Dokument>? Dokumenty { get; set; }
    }
}
