using System.Security.Claims;
using API.Alimed.Data;
using API.Alimed.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Alimed.Controllers.Lekarze
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]

    public class LekarzeController : ControllerBase
    {
        private readonly AppDbContext _db;
        public LekarzeController(AppDbContext db)
        {
            _db = db;
        }



        [HttpGet("moje-wizyty")]
        [Authorize(Roles = "Lekarz")]
        public async Task<IResult> GetMojeWizytyLekarza()
        {
            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var lekarz = await _db.Lekarze
                .FirstOrDefaultAsync(l => l.UserId == userId);

            if (lekarz == null)
                return Results.NotFound("Nie znaleziono lekarza.");

            var wizyty = await _db.Wizyty
                .Where(w => w.LekarzId == lekarz.LekarzId)
                .OrderBy(w => w.DataWizyty)
                .Select(w => new
                {
                    w.WizytaId,
                    w.DataWizyty,
                    w.Status,
                    Pacjent = w.Pacjent.Imie + " " + w.Pacjent.Nazwisko,
                    w.Diagnoza
                })
                .ToListAsync();

            return Results.Ok(wizyty);
        }


        // [HttpGet]
        // [Authorize(Roles = "User")]
        // public async Task<IResult> GetLekarze([FromQuery] int placowkaId)
        // {
        //     var lekarze = await _db.Lekarze
        //         .AsNoTracking()
        //         .Where(l => l.PlacowkaId == placowkaId)
        //         .Select(l => new
        //         {
        //             l.LekarzId,
        //             l.Imie,
        //             l.Nazwisko,
        //             l.Specjalizacja
        //         })
        //         .ToListAsync();

        // return Results.Ok(lekarze);
        // }

        [HttpGet]
        [Authorize(Roles = "User, Admin")]
        public async Task<IResult> GetLekarze([FromQuery] int? placowkaId)
        {
            var q = _db.Lekarze.AsNoTracking().AsQueryable();

            if (placowkaId.HasValue)
                q = q.Where(l => l.PlacowkaId == placowkaId.Value);

            var lekarze = await q
                .OrderBy(l => l.Nazwisko)
                .Select(l => new
                {
                    l.LekarzId,
                    l.Imie,
                    l.Nazwisko,
                    l.Specjalizacja,
                    l.PlacowkaId
                })
                .ToListAsync();

            return Results.Ok(lekarze);
        }




        // PUT / UPDATE
        







    }
}
