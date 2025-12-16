using API.AliMed.Data;
using API.AliMed.DTOs;
using API.AliMed.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.AliMed.Endpoints
{
    public class WizytyEndpoints
    {
        public static void MapWizytyEndpoints(IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/wizyty");

            group.MapGet("/", GetAllWizyty);
            group.MapGet("/moje-wizyty", GetUserWizyty);
            group.MapGet("/{id:int}", GetWizytaById);
            group.MapPost("/umow-wizyte", CreateWizyta);
        }

        private static async Task<IResult> GetAllWizyty(AppDbContext db)
        {
            var wizyty = await db.Wizyty
                .Include(w => w.Lekarz)
                .Include(w => w.Pacjent)
                .AsNoTracking()
                .OrderByDescending(w => w.DataWizyty)
                .Select(w => ToDto(w))
                .ToListAsync();
            return Results.Ok(wizyty);
        }

        private static async Task<IResult> GetUserWizyty(AppDbContext db)
        {
            var wizyty = await db.Wizyty
                .Include(w => w.Lekarz)
                .Include(w => w.Pacjent)
                .AsNoTracking()
                .OrderByDescending(w => w.DataWizyty)
                .Select(w => ToDto(w))
                .ToListAsync();
            return Results.Ok(wizyty);
        }

        private static async Task<IResult> GetWizytaById(int id, AppDbContext db)
        {
            var wizyta = await db.Wizyty
                .Include(w => w.Lekarz)
                .Include(w => w.Pacjent)
                .AsNoTracking()
                .FirstOrDefaultAsync(w => w.WizytaId == id);

            return wizyta is null ? Results.NotFound() : Results.Ok(ToDto(wizyta));
        }

        private static object ToDto(Wizyta w) => new
        {
            w.WizytaId,
            w.DataWizyty,
            w.Diagnoza,
            w.CzyOdbyta,
            w.PacjentId,
            w.LekarzId,
            w.PlacowkaId,
            Lekarz = w.Lekarz == null ? null : new { w.Lekarz.LekarzId, w.Lekarz.Imie, w.Lekarz.Nazwisko, w.Lekarz.Specjalizacja },
            Pacjent = w.Pacjent == null ? null : new { w.Pacjent.PacjentId, w.Pacjent.Imie, w.Pacjent.Nazwisko }
        };

        private static async Task<IResult> CreateWizyta(WizytaCreateRequest request, AppDbContext db)
        {
            var anyPacjent = await db.Pacjenci.AsNoTracking().FirstOrDefaultAsync();
            var anyPlacowka = await db.Placowki.AsNoTracking().FirstOrDefaultAsync();
            if (anyPacjent is null || anyPlacowka is null)
            {
                return Results.BadRequest("Brakuje danych pacjenta lub placówki w bazie.");
            }

            var wizyta = new Wizyta
            {
                DataWizyty = request.DataWizyty,
                Diagnoza = request.Diagnoza,
                CzyOdbyta = false,
                PacjentId = anyPacjent.PacjentId,
                LekarzId = request.LekarzId ?? db.Lekarze.Select(l => l.LekarzId).First(),
                PlacowkaId = request.PlacowkaId ?? anyPlacowka.PlacowkaId
            };

            db.Wizyty.Add(wizyta);
            await db.SaveChangesAsync();

            return Results.Created($"/api/wizyty/{wizyta.WizytaId}", new { message = "Wizyta została umówiona", wizytaId = wizyta.WizytaId });
        }
    }
}
