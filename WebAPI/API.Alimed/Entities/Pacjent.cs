namespace API.Alimed.Entities
{
    public class Pacjent
    {
        public int PacjentId { get; set; }

        public string? Imie { get; set; }
        public string? Nazwisko { get; set; }
        public string? Pesel { get; set; } // unique

        // OwnEntity zamiast dodatkowej tabeli bedzie prefix AdresZamieszkania w nazwie kolumny w Pacjent
        public Adres? AdresZamieszkania { get; set; }

        public DateTime DataUrodzenia { get; set; }

        public Guid? UserId { get; set; } //FK do User

        // relacja 1:N
        // 1 pacjent wiele wizyt
        public ICollection<Wizyta>? Wizyty { get; set; }

        public ICollection<Dokument>? Dokumenty { get; set; }


        public User? User { get; set; } = null!;
    }
}
