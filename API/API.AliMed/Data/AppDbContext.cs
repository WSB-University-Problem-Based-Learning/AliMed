using API.AliMed.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.AliMed.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {}

        public DbSet<Placowka> Placowki { get; set; }
        public DbSet<Lekarz> Lekarze { get; set; }
        public DbSet<Pacjent> Pacjenci { get; set; }
        public DbSet<Wizyta> Wizyty { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // own entity
            modelBuilder.Entity<Pacjent>().OwnsOne(p => p.AdresZamieszkania);

            // own entity
            modelBuilder.Entity<Placowka>().OwnsOne(p => p.AdresPlacowki);

            // ------------------ relacje i fk ------------------

            // wymuszenie unikalny PESELa
            modelBuilder.Entity<Pacjent>()
                .HasIndex(p => p.Pesel)
                .IsUnique();

            // relacja 1:N Placówka -> Lekarzami
            modelBuilder.Entity<Lekarz>()
                .HasOne(l => l.Placowka)
                .WithMany(p => p.Lekarze)
                .HasForeignKey(l => l.PlacowkaId);

            // relacja 1:N Pacjent -> Wizyty
            modelBuilder.Entity<Wizyta>()
                .HasOne(w => w.Pacjent)
                .WithMany(p => p.Wizyty)
                .HasForeignKey(w => w.PacjentId)
                // cascade - jesli usuniesz pacjenta usun tez jego wizyty
                .OnDelete(DeleteBehavior.Cascade);

            // relacja 1:N Lekarz -> Wizyty
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

            base.OnModelCreating(modelBuilder);
        }




    }
}
