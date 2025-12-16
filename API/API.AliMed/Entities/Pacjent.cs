namespace API.AliMed.Entities
{
    public class Pacjent
    {
        public int PacjentId { get; set; }

        public string? Imie { get; set; }
        public string? Nazwisko  { get; set; }
        public string? Pesel { get; set; } // unique

        // powiazanie z kontem uzytkownika (opcjonalne)
        public string? UserId { get; set; }

        // OwnEntity zamiast dodatkowej tabeli bedzie prefix AdresZamieszkania w nazwie kolumny w Pacjent
        public Adres? AdresZamieszkania { get; set; }

        public DateTime DataUrodzenia { get; set; }

        // relacja 1:N
        // 1 pacjent wiele wizyt
        public ICollection<Wizyta>? Wizyty { get; set; }
    }
}
