using API.Alimed.Entities;
using API.Alimed.Enums;
using Microsoft.EntityFrameworkCore;

namespace API.Alimed.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

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
            modelBuilder.Entity<Pacjent>()
                .HasIndex(p => p.Pesel)
                .IsUnique();

            modelBuilder.Entity<Pacjent>()
                .OwnsOne(p => p.AdresZamieszkania)
                .Property(a => a.Kraj)
                .IsRequired()
                .HasDefaultValue("Polska"); // domyślna wartość kraju

            modelBuilder.Entity<Pacjent>()
                    .HasOne(p => p.User)
                    .WithOne(p => p.Pacjent)
                    .HasForeignKey<Pacjent>(p => p.UserId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .IsRequired(false);



            // own entity
            modelBuilder.Entity<Placowka>()
                .OwnsOne(p => p.AdresPlacowki)
                .Property(a => a.Kraj)
                .IsRequired()
                .HasDefaultValue("Polska"); // domyślna wartość kraju



            // refresh token
            // relacja One-to-Many
            modelBuilder.Entity<RefreshToken>()
                  .HasOne(rt => rt.User)              // RefreshToken ma JEDEN obiekt User
                  .WithMany(u => u.RefreshTokens)     // User ma WIELE RefreshToken
                  .HasForeignKey(rt => rt.UserId)    // Klucz Obcy jest w RefreshToken
                  .IsRequired(false);



            // ------------------ relacje i fk ------------------

            // wymuszenie unikalny PESELa

            // relacja 1:N Placówka -> Lekarze
            modelBuilder.Entity<Lekarz>()
                .HasOne(l => l.Placowka)
                .WithMany(p => p.Lekarze)
                .HasForeignKey(l => l.PlacowkaId)
                .IsRequired(false);

            // 1:N Pacjent -> Wizyty
            modelBuilder.Entity<Wizyta>()
                    .HasOne(w => w.Pacjent)
                    .WithMany(p => p.Wizyty)
                    .HasForeignKey(w => w.PacjentId)
                    // cascade - usuniecie pacjenta usuwa tez jego wizyty
                    //.OnDelete(DeleteBehavior.Cascade)
                    .IsRequired(false);

            // 1:N Lekarz -> Wizyty
            modelBuilder.Entity<Wizyta>()
                    .HasOne(w => w.Lekarz)
                    .WithMany(l => l.Wizyty)
                    .HasForeignKey(w => w.LekarzId)
                    //.OnDelete(DeleteBehavior.Restrict) // nie usuniesz lekarza jesli ma przypisane wizyty
                    .IsRequired(false);

            // relacja 1:N Placowka -> Wizyty
            modelBuilder.Entity<Wizyta>()
                    .HasOne(w => w.Placowka)
                    .WithMany(p => p.Wizyty)
                    .HasForeignKey(w => w.PlacowkaId)
                    //.OnDelete(DeleteBehavior.Restrict)
                    .IsRequired(false);


            // ------------------ SEEDING DANYCH (HasData) ------------------

            // PLACÓWKI
            modelBuilder.Entity<Placowka>()
                .HasData(
                new[]
                {
                    new
                    {
                        PlacowkaId = 1,
                        Nazwa = "Przychodnia Zdrowie",
                        NumerKonta = "12 3456 7890 1234 5678 0000"
                    },
                    new
                    {
                        PlacowkaId = 2,
                        Nazwa = "Szpital Miejski",
                        NumerKonta = "98 7654 3210 9876 5432 0000"
                    },
                    new
                    {
                        PlacowkaId = 3,
                        Nazwa = "Centrum Rehabilitacji",
                        NumerKonta = "37 1020 5555 1234 5678 9012 0000"
                    },
                    new
                    {
                        PlacowkaId = 4,
                        Nazwa = "Novum Centrum Diagnostyki",
                        NumerKonta = "61 1140 2000 0000 1111 2222 3333"
                    },
                    new
                    {
                        PlacowkaId = 5,
                        Nazwa = "VitaMed Klinika",
                        NumerKonta = "85 2490 0000 0000 4567 8901 2345"
                    }
                });

            // Owned entity for Placowka
                modelBuilder.Entity<Placowka>()
                .OwnsOne(p => p.AdresPlacowki)
                .HasData(
                    new { PlacowkaId = 1, Ulica = "Lipowa", NumerDomu = "10", KodPocztowy = "00-001", Miasto = "Warszawa", Kraj = "Polska" },
                    new { PlacowkaId = 2, Ulica = "Kwiatowa", NumerDomu = "5A", KodPocztowy = "01-234", Miasto = "Kraków", Kraj = "Polska" },
                    new { PlacowkaId = 3, Ulica = "Słoneczna", NumerDomu = "21B/3", KodPocztowy = "80-800", Miasto = "Gdańsk", Kraj = "Polska" },
                    new { PlacowkaId = 4, Ulica = "Przemysłowa", NumerDomu = "77", KodPocztowy = "60-900", Miasto = "Poznań", Kraj = "Polska" },
                    new { PlacowkaId = 5, Ulica = "Leśna Aleja", NumerDomu = "4", KodPocztowy = "50-101", Miasto = "Wrocław", Kraj = "Polska" }
                );

            // LEKARZE
            modelBuilder.Entity<Lekarz>()
                .HasData(
                new[]
                {
                    // === PLACÓWKA 1 (3 lekarzy) ===
                    new Lekarz { LekarzId = 1, Imie = "Jan", Nazwisko = "Kowalski", Specjalizacja = "Internista", PlacowkaId = 1 },
                    new Lekarz { LekarzId = 2, Imie = "Anna", Nazwisko = "Nowak", Specjalizacja = "Pediatra", PlacowkaId = 1 },
                    new Lekarz { LekarzId = 3, Imie = "Piotr", Nazwisko = "Zieliński", Specjalizacja = "Kardiolog", PlacowkaId = 1 },

                    // === PLACÓWKA 2 (3 lekarzy) ===
                    new Lekarz { LekarzId = 4, Imie = "Marta", Nazwisko = "Wójcik", Specjalizacja = "Dermatolog", PlacowkaId = 2 },
                    new Lekarz { LekarzId = 5, Imie = "Krzysztof", Nazwisko = "Kowalczyk", Specjalizacja = "Ortopeda", PlacowkaId = 2 },
                    new Lekarz { LekarzId = 6, Imie = "Ewa", Nazwisko = "Lewandowska", Specjalizacja = "Ginekolog", PlacowkaId = 2 },

                    // === PLACÓWKA 3 (8 lekarzy - większa specjalizacja) ===
                    new Lekarz { LekarzId = 7, Imie = "Tomasz", Nazwisko = "Kaczmarek", Specjalizacja = "Neurolog", PlacowkaId = 3 },
                    new Lekarz { LekarzId = 8, Imie = "Magdalena", Nazwisko = "Mazur", Specjalizacja = "Endokrynolog", PlacowkaId = 3 },
                    new Lekarz { LekarzId = 9, Imie = "Robert", Nazwisko = "Więckowski", Specjalizacja = "Urolog", PlacowkaId = 3 },
                    new Lekarz { LekarzId = 10, Imie = "Joanna", Nazwisko = "Borkowska", Specjalizacja = "Okulista", PlacowkaId = 3 },
                    new Lekarz { LekarzId = 11, Imie = "Adam", Nazwisko = "Gajewski", Specjalizacja = "Pulmonolog", PlacowkaId = 3 },
                    new Lekarz { LekarzId = 12, Imie = "Natalia", Nazwisko = "Wróbel", Specjalizacja = "Reumatolog", PlacowkaId = 3 },
                    new Lekarz { LekarzId = 13, Imie = "Michał", Nazwisko = "Jankowski", Specjalizacja = "Hematolog", PlacowkaId = 3 },
                    new Lekarz { LekarzId = 14, Imie = "Monika", Nazwisko = "Zając", Specjalizacja = "Psychiatra", PlacowkaId = 3 },

                    // === PLACÓWKA 4 (18 lekarzy - duża klinika) ===
                    new Lekarz { LekarzId = 15, Imie = "Andrzej", Nazwisko = "Pietrzak", Specjalizacja = "Internista", PlacowkaId = 4 },
                    new Lekarz { LekarzId = 16, Imie = "Barbara", Nazwisko = "Sikora", Specjalizacja = "Pediatra", PlacowkaId = 4 },
                    new Lekarz { LekarzId = 17, Imie = "Cezary", Nazwisko = "Kruk", Specjalizacja = "Chirurg", PlacowkaId = 4 },
                    new Lekarz { LekarzId = 18, Imie = "Daria", Nazwisko = "Lis", Specjalizacja = "Anestezjolog", PlacowkaId = 4 },
                    new Lekarz { LekarzId = 19, Imie = "Filip", Nazwisko = "Wysocki", Specjalizacja = "Kardiolog", PlacowkaId = 4 },
                    new Lekarz { LekarzId = 20, Imie = "Gabriela", Nazwisko = "Mazurek", Specjalizacja = "Dermatolog", PlacowkaId = 4 },
                    new Lekarz { LekarzId = 21, Imie = "Hubert", Nazwisko = "Kołodziej", Specjalizacja = "Ortopeda", PlacowkaId = 4 },
                    new Lekarz { LekarzId = 22, Imie = "Irena", Nazwisko = "Bąk", Specjalizacja = "Ginekolog", PlacowkaId = 4 },
                    new Lekarz { LekarzId = 23, Imie = "Jerzy", Nazwisko = "Kalinowski", Specjalizacja = "Neurolog", PlacowkaId = 4 },
                    new Lekarz { LekarzId = 24, Imie = "Kinga", Nazwisko = "Kwiatkowska", Specjalizacja = "Endokrynolog", PlacowkaId = 4 },
                    new Lekarz { LekarzId = 25, Imie = "Lech", Nazwisko = "Wiśniewski", Specjalizacja = "Urolog", PlacowkaId = 4 },
                    new Lekarz { LekarzId = 26, Imie = "Mariola", Nazwisko = "Jasińska", Specjalizacja = "Okulista", PlacowkaId = 4 },
                    new Lekarz { LekarzId = 27, Imie = "Norbert", Nazwisko = "Olszewski", Specjalizacja = "Pulmonolog", PlacowkaId = 4 },
                    new Lekarz { LekarzId = 28, Imie = "Olimpia", Nazwisko = "Pająk", Specjalizacja = "Reumatolog", PlacowkaId = 4 },
                    new Lekarz { LekarzId = 29, Imie = "Paweł", Nazwisko = "Czarnecki", Specjalizacja = "Hematolog", PlacowkaId = 4 },
                    new Lekarz { LekarzId = 30, Imie = "Renata", Nazwisko = "Górska", Specjalizacja = "Psychiatra", PlacowkaId = 4 },
                    new Lekarz { LekarzId = 31, Imie = "Sebastian", Nazwisko = "Wróblewski", Specjalizacja = "Geriatra", PlacowkaId = 4 },
                    new Lekarz { LekarzId = 32, Imie = "Teresa", Nazwisko = "Maciejewska", Specjalizacja = "Onkolog", PlacowkaId = 4 },

                    // === PLACÓWKA 5 (18 lekarzy - duża klinika) ===
                    new Lekarz { LekarzId = 33, Imie = "Urszula", Nazwisko = "Sobczak", Specjalizacja = "Internista", PlacowkaId = 5 },
                    new Lekarz { LekarzId = 34, Imie = "Wiktor", Nazwisko = "Michalski", Specjalizacja = "Pediatra", PlacowkaId = 5 },
                    new Lekarz { LekarzId = 35, Imie = "Zuzanna", Nazwisko = "Adamczyk", Specjalizacja = "Chirurg", PlacowkaId = 5 },
                    new Lekarz { LekarzId = 36, Imie = "Bartosz", Nazwisko = "Szewczyk", Specjalizacja = "Anestezjolog", PlacowkaId = 5 },
                    new Lekarz { LekarzId = 37, Imie = "Dagmara", Nazwisko = "Walczak", Specjalizacja = "Kardiolog", PlacowkaId = 5 },
                    new Lekarz { LekarzId = 38, Imie = "Fryderyk", Nazwisko = "Zieliński", Specjalizacja = "Dermatolog", PlacowkaId = 5 },
                    new Lekarz { LekarzId = 39, Imie = "Grażyna", Nazwisko = "Baranowska", Specjalizacja = "Ortopeda", PlacowkaId = 5 },
                    new Lekarz { LekarzId = 40, Imie = "Igor", Nazwisko = "Szymański", Specjalizacja = "Ginekolog", PlacowkaId = 5 },
                    new Lekarz { LekarzId = 41, Imie = "Jolanta", Nazwisko = "Wojciechowska", Specjalizacja = "Neurolog", PlacowkaId = 5 },
                    new Lekarz { LekarzId = 42, Imie = "Kamil", Nazwisko = "Krupa", Specjalizacja = "Endokrynolog", PlacowkaId = 5 },
                    new Lekarz { LekarzId = 43, Imie = "Lidia", Nazwisko = "Piotrowska", Specjalizacja = "Urolog", PlacowkaId = 5 },
                    new Lekarz { LekarzId = 44, Imie = "Marek", Nazwisko = "Grabowski", Specjalizacja = "Okulista", PlacowkaId = 5 },
                    new Lekarz { LekarzId = 45, Imie = "Nina", Nazwisko = "Rutkowska", Specjalizacja = "Pulmonolog", PlacowkaId = 5 },
                    new Lekarz { LekarzId = 46, Imie = "Oskar", Nazwisko = "Kowalski", Specjalizacja = "Reumatolog", PlacowkaId = 5 },
                    new Lekarz { LekarzId = 47, Imie = "Patrycja", Nazwisko = "Zaręba", Specjalizacja = "Hematolog", PlacowkaId = 5 },
                    new Lekarz { LekarzId = 48, Imie = "Rafał", Nazwisko = "Barański", Specjalizacja = "Psychiatra", PlacowkaId = 5 },
                    new Lekarz { LekarzId = 49, Imie = "Sandra", Nazwisko = "Konieczna", Specjalizacja = "Geriatra", PlacowkaId = 5 },
                    new Lekarz { LekarzId = 50, Imie = "Wiktor", Nazwisko = "Krawczyk", Specjalizacja = "Onkolog", PlacowkaId = 5 }
                            }
                        );




            // USERS

            var adminUserId = Guid.Parse("A0000000-0000-0000-0000-000000000001");
            var user1Id = Guid.Parse("B0000000-0000-0000-0000-000000000001");
            var user2Id = Guid.Parse("B0000000-0000-0000-0000-000000000002");
            var user3Id = Guid.Parse("B0000000-0000-0000-0000-000000000003");
            var user4Id = Guid.Parse("B0000000-0000-0000-0000-000000000004");
            var user5Id = Guid.Parse("B0000000-0000-0000-0000-000000000005");

            //modelBuilder.Entity<User>().HasData(
            //    new
            //    {
            //        UserId = adminUserId,
            //        Username = "admin_alimed",
            //        Role = UserRole.Admin // konto admina
            //    },
            //    new { UserId = user1Id, Username = "pacjent1", Role = API.Alimed.Enums.UserRole.User },
            //    new { UserId = user2Id, Username = "pacjent2", Role = API.Alimed.Enums.UserRole.User },
            //    new { UserId = user3Id, Username = "pacjent3", Role = API.Alimed.Enums.UserRole.User },
            //    new { UserId = user4Id, Username = "pacjent4", Role = API.Alimed.Enums.UserRole.User },
            //    new { UserId = user5Id, Username = "pacjent5", Role = API.Alimed.Enums.UserRole.User }
            //);

            modelBuilder.Entity<User>().HasData(
                new
                {
                    UserId = adminUserId,
                    Username = "admin_alimed",
                    Role = UserRole.Admin,
                    IsGithubUser = false,
                    GithubId = (string?)null
                },
                new
                {
                    UserId = user1Id,
                    Username = "pacjent1",
                    Role = UserRole.User,
                    IsGithubUser = false,
                    GithubId = (string?)null
                },
                new
                {
                    UserId = user2Id,
                    Username = "pacjent2",
                    Role = UserRole.User,
                    IsGithubUser = false,
                    GithubId = (string?)null
                },
                new
                {
                    UserId = user3Id,
                    Username = "pacjent3",
                    Role = UserRole.User,
                    IsGithubUser = false,
                    GithubId = (string?)null
                },
                new
                {
                    UserId = user4Id,
                    Username = "pacjent4",
                    Role = UserRole.User,
                    IsGithubUser = false,
                    GithubId = (string?)null
                },
                new
                {
                    UserId = user5Id,
                    Username = "pacjent5",
                    Role = UserRole.User,
                    IsGithubUser = false,
                    GithubId = (string?)null
                }
            );




            // PACJENCI (wymaga utworzenia Userów powyżej)
            modelBuilder.Entity<Pacjent>().HasData(
                new
                {
                    PacjentId = 1,
                    Imie = "Alicja",
                    Nazwisko = "Bąk",
                    Pesel = "90050112345",
                    DataUrodzenia = new DateTime(1990, 5, 1),
                    UserId = user1Id
                },
                new
                {
                    PacjentId = 2,
                    Imie = "Robert",
                    Nazwisko = "Cygan",
                    Pesel = "85112054321",
                    DataUrodzenia = new DateTime(1985, 11, 20),
                    UserId = user2Id
                },
                new
                {
                    PacjentId = 3,
                    Imie = "Karolina",
                    Nazwisko = "Duda",
                    Pesel = "75021598765",
                    DataUrodzenia = new DateTime(1975, 2, 15),
                    UserId = user3Id
                },
                new
                {
                    PacjentId = 4,
                    Imie = "Maksymilian",
                    Nazwisko = "Falkowski",
                    Pesel = "01081033344",
                    DataUrodzenia = new DateTime(2001, 8, 10),
                    UserId = user4Id
                },
                new
                {
                    PacjentId = 5,
                    Imie = "Zofia",
                    Nazwisko = "Górecka",
                    Pesel = "68092288899",
                    DataUrodzenia = new DateTime(1968, 9, 22),
                    UserId = user5Id
                }
            );





            // OWNED ENTITY AdresZamieszkania dla Pacjentów
            modelBuilder.Entity<Pacjent>()
                .OwnsOne(p => p.AdresZamieszkania)
                .HasData(
                    new
                    {
                        PacjentId = 1,
                        Ulica = "Długa",
                        NumerDomu = "3/1",
                        KodPocztowy = "00-010",
                        Kraj = "Polska",
                        Miasto = "Warszawa"
                    },
                    new
                    {
                        PacjentId = 2,
                        Ulica = "Krótka",
                        NumerDomu = "15",
                        KodPocztowy = "30-011",
                        Kraj = "Polska",
                        Miasto = "Kraków"
                    },
                    new
                    {
                        PacjentId = 3,
                        Ulica = "Wodna",
                        NumerDomu = "2A",
                        KodPocztowy = "80-123",
                        Kraj = "Polska",
                        Miasto = "Gdańsk"
                    },
                    new
                    {
                        PacjentId = 4,
                        Ulica = "Rzeczna",
                        NumerDomu = "88B",
                        KodPocztowy = "60-700",
                        Kraj = "Polska",
                        Miasto = "Poznań"
                    },
                    new
                    {
                        PacjentId = 5,
                        Ulica = "Północna",
                        NumerDomu = "45",
                        KodPocztowy = "50-400",
                        Kraj = "Polska",
                        Miasto = "Wrocław"
                    }
                );



            // WIZYTY (Łącznie 25 rekordów)
            modelBuilder.Entity<Wizyta>().HasData(
                // === PACJENT 1 (Alicja Bąk) - Wizyty w różnych placówkach ===
                new { WizytaId = 1, DataWizyty = new DateTime(2025, 1, 15, 10, 0, 0), Diagnoza = "Grypa sezonowa", CzyOdbyta = true, PacjentId = 1, LekarzId = 1, PlacowkaId = 1 }, // Lekarz 1, Placówka 1
                new { WizytaId = 2, DataWizyty = new DateTime(2025, 2, 20, 11, 30, 0), Diagnoza = "Kontrola ciśnienia", CzyOdbyta = true, PacjentId = 1, LekarzId = 7, PlacowkaId = 3 }, // Lekarz 7, Placówka 3
                new { WizytaId = 3, DataWizyty = new DateTime(2025, 3, 5, 14, 0, 0), Diagnoza = "Badanie okresowe", CzyOdbyta = true, PacjentId = 1, LekarzId = 15, PlacowkaId = 4 }, // Lekarz 15, Placówka 4
                new { WizytaId = 4, DataWizyty = new DateTime(2025, 4, 1, 9, 0, 0), Diagnoza = "Wizyta u kardiologa", CzyOdbyta = true, PacjentId = 1, LekarzId = 37, PlacowkaId = 5 }, // Lekarz 37, Placówka 5
                new { WizytaId = 5, DataWizyty = new DateTime(2025, 5, 10, 15, 30, 0), Diagnoza = "Badanie krwi (planowana)", CzyOdbyta = false, PacjentId = 1, LekarzId = 4, PlacowkaId = 2 }, // Lekarz 4, Placówka 2

                // === PACJENT 2 (Robert Cygan) ===
                new { WizytaId = 6, DataWizyty = new DateTime(2025, 1, 25, 8, 30, 0), Diagnoza = "Ból pleców", CzyOdbyta = true, PacjentId = 2, LekarzId = 5, PlacowkaId = 2 }, // Lekarz 5, Placówka 2
                new { WizytaId = 7, DataWizyty = new DateTime(2025, 2, 1, 16, 0, 0), Diagnoza = "Skręcenie kostki", CzyOdbyta = true, PacjentId = 2, LekarzId = 21, PlacowkaId = 4 }, // Lekarz 21, Placówka 4
                new { WizytaId = 8, DataWizyty = new DateTime(2025, 3, 15, 12, 0, 0), Diagnoza = "Kontrola po urazie", CzyOdbyta = true, PacjentId = 2, LekarzId = 39, PlacowkaId = 5 }, // Lekarz 39, Placówka 5
                new { WizytaId = 9, DataWizyty = new DateTime(2025, 4, 10, 10, 0, 0), Diagnoza = "Wizyta u dermatologa", CzyOdbyta = true, PacjentId = 2, LekarzId = 20, PlacowkaId = 4 }, // Lekarz 20, Placówka 4
                new { WizytaId = 10, DataWizyty = new DateTime(2025, 5, 25, 11, 0, 0), Diagnoza = "Wizyta kontrolna (planowana)", CzyOdbyta = false, PacjentId = 2, LekarzId = 1, PlacowkaId = 1 }, // Lekarz 1, Placówka 1

                // === PACJENT 3 (Karolina Duda) ===
                new { WizytaId = 11, DataWizyty = new DateTime(2025, 1, 5, 13, 0, 0), Diagnoza = "Wizyta u endokrynologa", CzyOdbyta = true, PacjentId = 3, LekarzId = 8, PlacowkaId = 3 }, // Lekarz 8, Placówka 3
                new { WizytaId = 12, DataWizyty = new DateTime(2025, 2, 28, 9, 30, 0), Diagnoza = "Problemy ze snem", CzyOdbyta = true, PacjentId = 3, LekarzId = 30, PlacowkaId = 4 }, // Lekarz 30, Placówka 4
                new { WizytaId = 13, DataWizyty = new DateTime(2025, 3, 22, 17, 0, 0), Diagnoza = "Badania hormonalne", CzyOdbyta = true, PacjentId = 3, LekarzId = 42, PlacowkaId = 5 }, // Lekarz 42, Placówka 5
                new { WizytaId = 14, DataWizyty = new DateTime(2025, 4, 18, 11, 0, 0), Diagnoza = "Konsultacja psychiatryczna", CzyOdbyta = true, PacjentId = 3, LekarzId = 48, PlacowkaId = 5 }, // Lekarz 48, Placówka 5
                new { WizytaId = 15, DataWizyty = new DateTime(2025, 5, 1, 13, 0, 0), Diagnoza = "Konsultacja ginekologiczna (planowana)", CzyOdbyta = false, PacjentId = 3, LekarzId = 6, PlacowkaId = 2 }, // Lekarz 6, Placówka 2

                // === PACJENT 4 (Maksymilian Falkowski) ===
                new { WizytaId = 16, DataWizyty = new DateTime(2025, 1, 1, 10, 0, 0), Diagnoza = "Ból głowy", CzyOdbyta = true, PacjentId = 4, LekarzId = 23, PlacowkaId = 4 }, // Lekarz 23, Placówka 4
                new { WizytaId = 17, DataWizyty = new DateTime(2025, 2, 14, 14, 30, 0), Diagnoza = "Kontrola okulistyczna", CzyOdbyta = true, PacjentId = 4, LekarzId = 10, PlacowkaId = 3 }, // Lekarz 10, Placówka 3
                new { WizytaId = 18, DataWizyty = new DateTime(2025, 3, 30, 8, 0, 0), Diagnoza = "Wizyta u pulmonologa", CzyOdbyta = true, PacjentId = 4, LekarzId = 27, PlacowkaId = 4 }, // Lekarz 27, Placówka 4
                new { WizytaId = 19, DataWizyty = new DateTime(2025, 4, 25, 12, 0, 0), Diagnoza = "Zapalenie spojówek", CzyOdbyta = true, PacjentId = 4, LekarzId = 44, PlacowkaId = 5 }, // Lekarz 44, Placówka 5
                new { WizytaId = 20, DataWizyty = new DateTime(2025, 5, 8, 14, 0, 0), Diagnoza = "Szczepienie (planowane)", CzyOdbyta = false, PacjentId = 4, LekarzId = 2, PlacowkaId = 1 }, // Lekarz 2, Placówka 1

                // === PACJENT 5 (Zofia Górecka) ===
                new { WizytaId = 21, DataWizyty = new DateTime(2025, 1, 10, 11, 0, 0), Diagnoza = "Ból stawów", CzyOdbyta = true, PacjentId = 5, LekarzId = 12, PlacowkaId = 3 }, // Lekarz 12, Placówka 3
                new { WizytaId = 22, DataWizyty = new DateTime(2025, 2, 5, 13, 30, 0), Diagnoza = "Zalecenia reumatologiczne", CzyOdbyta = true, PacjentId = 5, LekarzId = 28, PlacowkaId = 4 }, // Lekarz 28, Placówka 4
                new { WizytaId = 23, DataWizyty = new DateTime(2025, 3, 1, 10, 0, 0), Diagnoza = "Kontrola geriatryczna", CzyOdbyta = true, PacjentId = 5, LekarzId = 31, PlacowkaId = 4 }, // Lekarz 31, Placówka 4
                new { WizytaId = 24, DataWizyty = new DateTime(2025, 4, 14, 9, 30, 0), Diagnoza = "Konsultacja onkologiczna", CzyOdbyta = true, PacjentId = 5, LekarzId = 50, PlacowkaId = 5 }, // Lekarz 50, Placówka 5
                new { WizytaId = 25, DataWizyty = new DateTime(2025, 5, 20, 16, 0, 0), Diagnoza = "Kontrola (planowana)", CzyOdbyta = false, PacjentId = 5, LekarzId = 3, PlacowkaId = 1 }  // Lekarz 3, Placówka 1
            );


            base.OnModelCreating(modelBuilder);
        }
         
    }
}


