using API.AliMed.Data;
using API.AliMed.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.AliMed.Endpoints
{
    public class PacjenciEndpoints
    {
        public static void MapPacjenciEndpoints(IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/authorizedendpoint/pacjenci");

            group.MapGet("/", GetAllPacjenci);
            group.MapGet("/{id:int}", GetPacjentById);
            group.MapPost("/", CreatePacjent);
            group.MapPut("/{id:int}", UpdatePacjent);
            group.MapDelete("/{id:int}", DeletePacjent);
        }

        private static async Task<IResult> GetAllPacjenci(AppDbContext db)
            => Results.Ok(await db.Pacjenci.AsNoTracking().ToListAsync());

        private static async Task<IResult> GetPacjentById(int id, AppDbContext db)
        {
            var pacjent = await db.Pacjenci.AsNoTracking().FirstOrDefaultAsync(p => p.PacjentId == id);
            return pacjent is null ? Results.NotFound() : Results.Ok(pacjent);
        }

        private static async Task<IResult> CreatePacjent(Pacjent pacjent, AppDbContext db)
        {
            db.Pacjenci.Add(pacjent);
            await db.SaveChangesAsync();
            return Results.Created($"/api/authorizedendpoint/pacjenci/{pacjent.PacjentId}", pacjent);
        }

        private static async Task<IResult> UpdatePacjent(int id, Pacjent updated, AppDbContext db)
        {
            var pacjent = await db.Pacjenci.FindAsync(id);
            if (pacjent is null) return Results.NotFound();

            pacjent.Imie = updated.Imie;
            pacjent.Nazwisko = updated.Nazwisko;
            pacjent.Pesel = updated.Pesel;
            pacjent.AdresZamieszkania = updated.AdresZamieszkania;
            pacjent.DataUrodzenia = updated.DataUrodzenia;
            pacjent.UserId = updated.UserId;

            await db.SaveChangesAsync();
            return Results.Ok(pacjent);
        }

        private static async Task<IResult> DeletePacjent(int id, AppDbContext db)
        {
            var pacjent = await db.Pacjenci.FindAsync(id);
            if (pacjent is null) return Results.NotFound();

            db.Pacjenci.Remove(pacjent);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }

    } 
}
