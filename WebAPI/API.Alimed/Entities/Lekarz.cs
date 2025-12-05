namespace API.Alimed.Entities
{
    public class Lekarz
    {
        public int LekarzId { get; set; }

        public string? Imie { get; set; }
        public string? Nazwisko { get; set; }
        public string? Specjalizacja { get; set; }

        // foreign key do placowki
        public int? PlacowkaId { get; set; }
        // prop nawigacyjne do relacji 1:N
        public Placowka? Placowka { get; set; }

        // Relacja 1:N
        // 1 lekarz wiele wizyt
        public ICollection<Wizyta>? Wizyty { get; set; }
    }
}
