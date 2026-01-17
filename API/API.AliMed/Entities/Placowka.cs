namespace API.AliMed.Entities
{
    public class Placowka
    {
        // primary key
        public int PlacowkaId { get; set; }

        public string? Nazwa { get; set; }

        // OwnEntity AdresPlacowki (zamiast dodatkowej tabeli bedzie prefix w nazwie kolumny w Placowka)
        public Adres? AdresPlacowki { get; set; }

        public string? NumerKonta { get; set; }

        // Relacja 1:N
        // 1 placowka wiele wizyt
        public ICollection<Wizyta>? Wizyty { get; set; }

        // Relacja 1:N 
        // 1 placowka wiele lekarzy
        public ICollection<Lekarz>? Lekarze { get; set; }
    }
}
