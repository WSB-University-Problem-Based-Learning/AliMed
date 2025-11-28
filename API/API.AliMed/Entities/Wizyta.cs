namespace API.AliMed.Entities
{
    public class Wizyta
    {
        public int WizytaId { get; set; }

        public DateTime DataWizyty { get; set; }
        public string? Diagnoza { get; set; }
        public bool CzyOdbyta { get; set; }

        // --- Relacje i klucze obce (FK) ---

        // foreign key do Pacjenta
        public int PacjentId { get; set; }
        public Pacjent? Pacjent { get; set; }

        // foreign key do Lekarza
        public int LekarzId { get; set; }
        public Lekarz? Lekarz { get; set; }

        // foreign key do Placowki
        public int PlacowkaId { get; set; }
        public Placowka? Placowka { get; set; }
    }
}
