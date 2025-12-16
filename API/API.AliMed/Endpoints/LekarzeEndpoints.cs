using API.AliMed.Data;
using API.AliMed.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.AliMed.Endpoints
{
    public class LekarzeEndpoints
    {
        public static void MapLekarzeEndpoints(IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/authorizedendpoint/lekarze");

            group.MapGet("/", GetAllLekarze);
            group.MapGet("/{id:int}", GetLekarzById);
            group.MapPost("/", CreateLekarz);
            group.MapPut("/{id:int}", UpdateLekarz);
            group.MapDelete("/{id:int}", DeleteLekarz);
        }

        private static async Task<IResult> GetAllLekarze(AppDbContext db)
            => Results.Ok(await db.Lekarze.AsNoTracking().ToListAsync());

        private static async Task<IResult> GetLekarzById(int id, AppDbContext db)
        {
            var lekarz = await db.Lekarze.AsNoTracking().FirstOrDefaultAsync(l => l.LekarzId == id);
            return lekarz is null ? Results.NotFound() : Results.Ok(lekarz);
        }

        private static async Task<IResult> CreateLekarz(Lekarz lekarz, AppDbContext db)
        {
            db.Lekarze.Add(lekarz);
            await db.SaveChangesAsync();
            return Results.Created($"/api/authorizedendpoint/lekarze/{lekarz.LekarzId}", lekarz);
        }

        private static async Task<IResult> UpdateLekarz(int id, Lekarz updated, AppDbContext db)
        {
            var lekarz = await db.Lekarze.FindAsync(id);
            if (lekarz is null) return Results.NotFound();

            lekarz.Imie = updated.Imie;
            lekarz.Nazwisko = updated.Nazwisko;
            lekarz.Specjalizacja = updated.Specjalizacja;
            lekarz.PlacowkaId = updated.PlacowkaId;

            await db.SaveChangesAsync();
            return Results.Ok(lekarz);
        }

        private static async Task<IResult> DeleteLekarz(int id, AppDbContext db)
        {
            var lekarz = await db.Lekarze.FindAsync(id);
            if (lekarz is null) return Results.NotFound();

            db.Lekarze.Remove(lekarz);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }
    }
}
