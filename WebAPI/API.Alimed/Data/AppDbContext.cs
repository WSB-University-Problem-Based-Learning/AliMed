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
                .OwnsOne(p => p.AdresZamieszkania);

            modelBuilder.Entity<Pacjent>()
                    .HasOne(p => p.User)
                    .WithOne()
                    .HasForeignKey<Pacjent>(p => p.UserId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .IsRequired(false);




            // own entity
            modelBuilder.Entity<Placowka>()
                .OwnsOne(p => p.AdresPlacowki);




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
                new
                {
                    PlacowkaId = 1,
                    Nazwa = "Przychodnia Zdrowie",
                    NumerKonta = "12 3456 7890 1234 5678 0000"
                }
            );

            // Owned entity for Placowka
            modelBuilder.Entity<Placowka>()
                .OwnsOne(p => p.AdresPlacowki)
                .HasData(
                new
                {
                    PlacowkaId = 1,
                    Ulica = "Lipowa",
                    NumerDomu = "10",
                    KodPocztowy = "00-001",
                    Miasto = "Warszawa",
                    Kraj = "Polska"
                }
            );

            // LEKARZE
            modelBuilder.Entity<Lekarz>()
                .HasData(
                new Lekarz
                {
                    LekarzId = 1,
                    Imie = "Jan",
                    Nazwisko = "Kowalski",
                    Specjalizacja = "Internista",
                    PlacowkaId = 1
                }
            );













            base.OnModelCreating(modelBuilder);
        }
         
    }
}


