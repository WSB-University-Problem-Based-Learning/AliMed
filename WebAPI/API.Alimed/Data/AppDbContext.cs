using API.Alimed.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Alimed.Data
{
    public class AppDbContext : DbContext
    {
            public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){ }

            public DbSet<Placowka> Placowki { get; set; }
            public DbSet<Lekarz> Lekarze { get; set; }
            public DbSet<Pacjent> Pacjenci { get; set; }
            public DbSet<Wizyta> Wizyty { get; set; }
            public DbSet<RefreshToken> RefreshToken { get; set; } // ICollection<RefreshToken> w User
            public DbSet<User> Users { get; set; }

            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                modelBuilder.Entity<User>().HasKey(u => u.UserId);
                modelBuilder.Entity<User>()
                    .HasIndex(u => u.GithubId)
                    .IsUnique();

                // own entity
                modelBuilder.Entity<Pacjent>().OwnsOne(p => p.AdresZamieszkania);
                modelBuilder.Entity<Pacjent>()
                    .HasOne(p => p.User)
                    .WithOne()
                    .HasForeignKey<Pacjent>(p => p.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                // own entity
                modelBuilder.Entity<Placowka>().OwnsOne(p => p.AdresPlacowki);

                // refresh token
                // relacja One-to-Many
                modelBuilder.Entity<RefreshToken>()
                    .HasOne(rt => rt.User)              // RefreshToken ma JEDEN obiekt User
                    .WithMany(u => u.RefreshTokens)     // User ma WIELE RefreshToken
                    .HasForeignKey(rt => rt.UserId);    // Klucz Obcy jest w RefreshToken

                // ------------------ relacje i fk ------------------

                // wymuszenie unikalny PESELa
                modelBuilder.Entity<Pacjent>()
                    .HasIndex(p => p.Pesel)
                    .IsUnique();

                // relacja 1:N Placówka -> Lekarze
                modelBuilder.Entity<Lekarz>()
                    .HasOne(l => l.Placowka)
                    .WithMany(p => p.Lekarze)
                    .HasForeignKey(l => l.PlacowkaId);

                // 1:N Pacjent -> Wizyty
                modelBuilder.Entity<Wizyta>()
                    .HasOne(w => w.Pacjent)
                    .WithMany(p => p.Wizyty)
                    .HasForeignKey(w => w.PacjentId)
                    // cascade - usuniecie pacjenta usuwa tez jego wizyty
                    .OnDelete(DeleteBehavior.Cascade);

                // 1:N Lekarz -> Wizyty
                modelBuilder.Entity<Wizyta>()
                    .HasOne(w => w.Lekarz)
                    .WithMany(l => l.Wizyty)
                    .HasForeignKey(w => w.LekarzId)
                    .OnDelete(DeleteBehavior.Restrict); // nie usuniesz lekarza jesli ma przypisane wizyty

                // relacja 1:N Placowka -> Wizyty
                modelBuilder.Entity<Wizyta>()
                    .HasOne(w => w.Placowka)
                    .WithMany(p => p.Wizyty)
                    .HasForeignKey(w => w.PlacowkaId)
                    .OnDelete(DeleteBehavior.Restrict);


                // ------------------ SEEDING DANYCH (HasData) ------------------

                // Placowka
                var placowki = new Placowka[]
                {
                new Placowka
                {
                    PlacowkaId = 1,
                    Nazwa = "Przychodnia Rodzinna \"Zdrowie\"",
                    NumerKonta = "12345678901234567890123456",
                    //AdresPlacowki = new Adres { Ulica = "Kwiatowa", NumerDomu = "5", KodPocztowy = "30-001", Miasto = "Kraków" }
                },
                new Placowka
                {
                    PlacowkaId = 2,
                    Nazwa = "Centrum Kardiologiczne",
                    NumerKonta = "98765432109876543210987654",
                    //AdresPlacowki = new Adres { Ulica = "Długa", NumerDomu = "22", KodPocztowy = "00-110", Miasto = "Warszawa" }
                }
                };
                modelBuilder.Entity<Placowka>().HasData(placowki);


                // Lekarze
                modelBuilder.Entity<Lekarz>().HasData(
                    new Lekarz { LekarzId = 101, Imie = "Anna", Nazwisko = "Kowalska", Specjalizacja = "Pediatra", PlacowkaId = 1 },
                    new Lekarz { LekarzId = 102, Imie = "Piotr", Nazwisko = "Nowak", Specjalizacja = "Kardiolog", PlacowkaId = 2 },
                    new Lekarz { LekarzId = 103, Imie = "Ewa", Nazwisko = "Wiśniewska", Specjalizacja = "Internista", PlacowkaId = 1 }
                );


                // Pajenci
                var pacjenci = new Pacjent[]
                {
                new Pacjent
                {
                    PacjentId = 201,
                    Imie = "Krzysztof",
                    Nazwisko = "Zając",
                    Pesel = "90010112345",
                    DataUrodzenia = new DateTime(1990, 1, 1),
                    //AdresZamieszkania = new Adres { Ulica = "Wesoła", NumerDomu = "1", KodPocztowy = "34-100", Miasto = "Wadowice" }
                },
                new Pacjent
                {
                    PacjentId = 202,
                    Imie = "Maria",
                    Nazwisko = "Zielińska",
                    Pesel = "85051567890",
                    DataUrodzenia = new DateTime(1985, 5, 15),
                    //AdresZamieszkania = new Adres { Ulica = "Słoneczna", NumerDomu = "10", KodPocztowy = "31-001", Miasto = "Kraków" }
                },
                new Pacjent
                {
                    PacjentId = 203,
                    Imie = "Adam",
                    Nazwisko = "Wójcik",
                    Pesel = "72121200112",
                    DataUrodzenia = new DateTime(1972, 12, 12),
                    //AdresZamieszkania = new Adres { Ulica = "Aleje Jerozolimskie", NumerDomu = "55", KodPocztowy = "00-001", Miasto = "Warszawa" }
                }
                };
                modelBuilder.Entity<Pacjent>().HasData(pacjenci);


                // Wizyta
                modelBuilder.Entity<Wizyta>().HasData(
                    new Wizyta
                    {
                        WizytaId = 301,
                        DataWizyty = new DateTime(2025, 11, 20, 10, 0, 0),
                        Diagnoza = "Zapalenie gardła",
                        CzyOdbyta = true,
                        PacjentId = 202,
                        LekarzId = 101,
                        PlacowkaId = 1
                    },
                    new Wizyta
                    {
                        WizytaId = 302,
                        DataWizyty = new DateTime(2025, 11, 21, 14, 30, 0),
                        Diagnoza = "Kontrola ciśnienia",
                        CzyOdbyta = true,
                        PacjentId = 203,
                        LekarzId = 102,
                        PlacowkaId = 2
                    },
                    new Wizyta
                    {
                        WizytaId = 303,
                        DataWizyty = new DateTime(2025, 12, 05, 9, 0, 0),
                        Diagnoza = null,
                        CzyOdbyta = false,
                        PacjentId = 201,
                        LekarzId = 103,
                        PlacowkaId = 1
                    }
                );


                base.OnModelCreating(modelBuilder);

            }
    }
}

