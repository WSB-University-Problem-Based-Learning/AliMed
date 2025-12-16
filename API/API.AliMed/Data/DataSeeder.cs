using API.AliMed.Entities;
using API.AliMed.Services;
using Microsoft.EntityFrameworkCore;

namespace API.AliMed.Data
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(AppDbContext db, CancellationToken cancellationToken = default)
        {
            await db.Database.EnsureCreatedAsync(cancellationToken);

            if (!db.Placowki.Any())
            {
                db.Placowki.AddRange(new[]
                {
                    new Placowka
                    {
                        Nazwa = "AliMed Klinika Centrum",
                        NumerKonta = "12 3456 7890 1234 5678 9012 3456",
                        AdresPlacowki = new Adres
                        {
                            Ulica = "Słoneczna",
                            NumerDomu = "12",
                            NumerMieszkania = null,
                            KodPocztowy = "50-123",
                            Miasto = "Wrocław",
                            Kraj = "Polska"
                        }
                    }
                });
                await db.SaveChangesAsync(cancellationToken);
            }

            if (!db.Lekarze.Any())
            {
                var placowkaId = db.Placowki.Select(p => p.PlacowkaId).First();
                db.Lekarze.AddRange(new[]
                {
                    new Lekarz { Imie = "Jan", Nazwisko = "Nowak", Specjalizacja = "Kardiolog", PlacowkaId = placowkaId },
                    new Lekarz { Imie = "Anna", Nazwisko = "Zielińska", Specjalizacja = "Dermatolog", PlacowkaId = placowkaId },
                    new Lekarz { Imie = "Piotr", Nazwisko = "Wiśniewski", Specjalizacja = "Ortopeda", PlacowkaId = placowkaId }
                });
                await db.SaveChangesAsync(cancellationToken);
            }

            if (!db.Pacjenci.Any())
            {
                db.Pacjenci.AddRange(new[]
                {
                    new Pacjent
                    {
                        Imie = "Kasia",
                        Nazwisko = "Kowalska",
                        Pesel = "90010112345",
                        DataUrodzenia = new DateTime(1990, 1, 1),
                        AdresZamieszkania = new Adres
                        {
                            Ulica = "Lipowa",
                            NumerDomu = "4",
                            NumerMieszkania = "7",
                            KodPocztowy = "00-123",
                            Miasto = "Warszawa",
                            Kraj = "Polska"
                        }
                    },
                    new Pacjent
                    {
                        Imie = "Marek",
                        Nazwisko = "Lewandowski",
                        Pesel = "85030354321",
                        DataUrodzenia = new DateTime(1985, 3, 3),
                        AdresZamieszkania = new Adres
                        {
                            Ulica = "Długa",
                            NumerDomu = "22",
                            NumerMieszkania = null,
                            KodPocztowy = "30-001",
                            Miasto = "Kraków",
                            Kraj = "Polska"
                        }
                    }
                });
                await db.SaveChangesAsync(cancellationToken);
            }

            if (!db.Wizyty.Any())
            {
                var pacjentId = db.Pacjenci.Select(p => p.PacjentId).First();
                var lekarzId = db.Lekarze.Select(l => l.LekarzId).First();
                var placowkaId = db.Placowki.Select(p => p.PlacowkaId).First();

                db.Wizyty.AddRange(new[]
                {
                    new Wizyta
                    {
                        DataWizyty = DateTime.UtcNow.AddDays(3),
                        Diagnoza = "Kontrola okresowa",
                        CzyOdbyta = false,
                        PacjentId = pacjentId,
                        LekarzId = lekarzId,
                        PlacowkaId = placowkaId
                    },
                    new Wizyta
                    {
                        DataWizyty = DateTime.UtcNow.AddDays(-7),
                        Diagnoza = "Wizyta kontrolna",
                        CzyOdbyta = true,
                        PacjentId = pacjentId,
                        LekarzId = lekarzId,
                        PlacowkaId = placowkaId
                    }
                });
                await db.SaveChangesAsync(cancellationToken);
            }

            if (!db.Dokumenty.Any())
            {
                var pacjentId = db.Pacjenci.Select(p => p.PacjentId).First();
                var wizytaId = db.Wizyty.Select(w => w.WizytaId).First();

                db.Dokumenty.AddRange(new[]
                {
                    new Dokument
                    {
                        NazwaPliku = "wynik-badan.pdf",
                        TypDokumentu = "wynik",
                        Opis = "Morfologia krwi",
                        DataUtworzenia = DateTime.UtcNow.AddDays(-5),
                        RozmiarPliku = 120 * 1024,
                        PacjentId = pacjentId,
                        WizytaId = wizytaId,
                        ZawartoscPliku = System.Text.Encoding.UTF8.GetBytes("Sample wynik badan")
                    },
                    new Dokument
                    {
                        NazwaPliku = "recepta.pdf",
                        TypDokumentu = "recepty",
                        Opis = "Leki na miesiąc",
                        DataUtworzenia = DateTime.UtcNow.AddDays(-2),
                        RozmiarPliku = 64 * 1024,
                        PacjentId = pacjentId,
                        WizytaId = wizytaId,
                        ZawartoscPliku = System.Text.Encoding.UTF8.GetBytes("Sample recepta")
                    }
                });
                await db.SaveChangesAsync(cancellationToken);
            }

            if (!db.Uzytkownicy.Any())
            {
                var firstPacjent = db.Pacjenci.First();
                var firstLekarz = db.Lekarze.First();

                db.Uzytkownicy.AddRange(new[]
                {
                    new UserAccount
                    {
                        Email = "demo@alimed.pl",
                        Username = "demo",
                        FirstName = firstPacjent.Imie,
                        LastName = firstPacjent.Nazwisko,
                        PasswordHash = PasswordHasher.Hash("Password123!"),
                        Role = UserRole.User,
                        PacjentId = firstPacjent.PacjentId,
                        UserId = firstPacjent.Pesel ?? Guid.NewGuid().ToString()
                    },
                    new UserAccount
                    {
                        Email = "dr.nowak@alimed.pl",
                        Username = "drnowak",
                        FirstName = firstLekarz.Imie,
                        LastName = firstLekarz.Nazwisko,
                        PasswordHash = PasswordHasher.Hash("Password123!"),
                        Role = UserRole.Lekarz,
                        LekarzId = firstLekarz.LekarzId
                    },
                    new UserAccount
                    {
                        Email = "admin@alimed.pl",
                        Username = "admin",
                        FirstName = "System",
                        LastName = "Admin",
                        PasswordHash = PasswordHasher.Hash("Admin123!"),
                        Role = UserRole.Admin
                    }
                });

                await db.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
