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

    // Trigger deployment v3 (test automation)
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
                    w.PacjentId,
                    Pacjent = w.Pacjent.Imie + " " + w.Pacjent.Nazwisko,
                    w.Diagnoza
                })
                .ToListAsync();

            return Results.Ok(wizyty);
        }

        [HttpGet("moje-nadchodzace-wizyty")]
        [Authorize(Roles = "Lekarz")]
        public async Task<IResult> GetMojeNadchodzaceWizytyLekarza()
        {
            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var lekarz = await _db.Lekarze
                .FirstOrDefaultAsync(l => l.UserId == userId);

            if (lekarz == null)
                return Results.NotFound("Nie znaleziono lekarza.");

            var teraz = DateTime.Now;

            var wizyty = await _db.Wizyty
                .Where(w =>
                    w.LekarzId == lekarz.LekarzId &&
                    w.Status == StatusWizyty.Zaplanowana &&
                    w.DataWizyty >= teraz)
                .OrderBy(w => w.DataWizyty)
                .Select(w => new
                {
                    w.WizytaId,
                    w.DataWizyty,
                    w.Status,
                    w.PacjentId,
                    Pacjent = w.Pacjent.Imie + " " + w.Pacjent.Nazwisko,
                    w.Diagnoza
                })
                .ToListAsync();

            return Results.Ok(wizyty);
        }

        [HttpGet("moje-wizyty/dzien")]
        [Authorize(Roles = "Lekarz")]
        public async Task<IResult> GetMojeWizytyDzien([FromQuery] DateTime date)
        {
            var (lekarz, error) = await GetCurrentLekarzAsync();
            if (lekarz == null)
                return error!;

            if (date == default)
                return Results.BadRequest("Niepoprawna data.");

            var start = date.Date;
            var end = start.AddDays(1);

            var wizyty = await _db.Wizyty
                .AsNoTracking()
                .Where(w =>
                    w.LekarzId == lekarz.LekarzId &&
                    w.DataWizyty >= start &&
                    w.DataWizyty < end)
                .OrderBy(w => w.DataWizyty)
                .Select(w => new
                {
                    w.WizytaId,
                    w.DataWizyty,
                    w.Status,
                    w.PacjentId,
                    Pacjent = w.Pacjent.Imie + " " + w.Pacjent.Nazwisko,
                    w.Diagnoza
                })
                .ToListAsync();

            return Results.Ok(wizyty);
        }

        [HttpGet("moje-wizyty/tydzien")]
        [Authorize(Roles = "Lekarz")]
        public async Task<IResult> GetMojeWizytyTydzien([FromQuery] DateTime date)
        {
            var (lekarz, error) = await GetCurrentLekarzAsync();
            if (lekarz == null)
                return error!;

            if (date == default)
                return Results.BadRequest("Niepoprawna data.");

            var day = date.Date;
            var diff = (7 + (int)day.DayOfWeek - (int)DayOfWeek.Monday) % 7;
            var start = day.AddDays(-diff);
            var end = start.AddDays(7);

            var wizyty = await _db.Wizyty
                .AsNoTracking()
                .Where(w =>
                    w.LekarzId == lekarz.LekarzId &&
                    w.DataWizyty >= start &&
                    w.DataWizyty < end)
                .OrderBy(w => w.DataWizyty)
                .Select(w => new
                {
                    w.WizytaId,
                    w.DataWizyty,
                    w.Status,
                    w.PacjentId,
                    Pacjent = w.Pacjent.Imie + " " + w.Pacjent.Nazwisko,
                    w.Diagnoza
                })
                .ToListAsync();

            return Results.Ok(wizyty);
        }

        [HttpGet("moje-wizyty/miesiac")]
        [Authorize(Roles = "Lekarz")]
        public async Task<IResult> GetMojeWizytyMiesiac([FromQuery] int year, [FromQuery] int month)
        {
            var (lekarz, error) = await GetCurrentLekarzAsync();
            if (lekarz == null)
                return error!;

            if (month < 1 || month > 12)
                return Results.BadRequest("Niepoprawny miesiac.");

            var start = new DateTime(year, month, 1);
            var end = start.AddMonths(1);

            var wizyty = await _db.Wizyty
                .AsNoTracking()
                .Where(w =>
                    w.LekarzId == lekarz.LekarzId &&
                    w.DataWizyty >= start &&
                    w.DataWizyty < end)
                .OrderBy(w => w.DataWizyty)
                .Select(w => new
                {
                    w.WizytaId,
                    w.DataWizyty,
                    w.Status,
                    w.PacjentId,
                    Pacjent = w.Pacjent.Imie + " " + w.Pacjent.Nazwisko,
                    w.Diagnoza
                })
                .ToListAsync();

            return Results.Ok(wizyty);
        }

        [HttpGet("moje-wizyty/zakres")]
        [Authorize(Roles = "Lekarz")]
        public async Task<IResult> GetMojeWizytyZakres([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            var (lekarz, error) = await GetCurrentLekarzAsync();
            if (lekarz == null)
                return error!;

            if (from == default || to == default)
                return Results.BadRequest("Niepoprawny zakres dat.");

            if (to < from)
                return Results.BadRequest("'to' musi byc >= 'from'.");

            if ((to.Date - from.Date).TotalDays > 31)
                return Results.BadRequest("Maksymalny zakres to 31 dni.");

            var start = from.Date;
            var end = to.Date.AddDays(1);

            var wizyty = await _db.Wizyty
                .AsNoTracking()
                .Where(w =>
                    w.LekarzId == lekarz.LekarzId &&
                    w.DataWizyty >= start &&
                    w.DataWizyty < end)
                .OrderBy(w => w.DataWizyty)
                .Select(w => new
                {
                    w.WizytaId,
                    w.DataWizyty,
                    w.Status,
                    w.PacjentId,
                    Pacjent = w.Pacjent.Imie + " " + w.Pacjent.Nazwisko,
                    w.Diagnoza
                })
                .ToListAsync();

            return Results.Ok(wizyty);
        }

        [HttpGet("pacjenci")]
        [Authorize(Roles = "Lekarz")]
        public async Task<IResult> GetPacjenciLekarza([FromQuery] string? query)
        {
            var (lekarz, error) = await GetCurrentLekarzAsync();
            if (lekarz == null)
                return error!;

            var q = _db.Pacjenci
                .AsNoTracking()
                .Where(p => p.Wizyty!.Any(w => w.LekarzId == lekarz.LekarzId))
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(query))
            {
                var normalized = query.Trim().ToLower();
                q = q.Where(p =>
                    (p.Imie + " " + p.Nazwisko).ToLower().Contains(normalized));
            }

            var pacjenci = await q
                .OrderBy(p => p.Nazwisko)
                .Select(p => new
                {
                    p.PacjentId,
                    p.Imie,
                    p.Nazwisko,
                    p.Pesel,
                    p.DataUrodzenia
                })
                .ToListAsync();

            return Results.Ok(pacjenci);
        }

        [HttpGet("pacjenci/{pacjentId}")]
        [Authorize(Roles = "Lekarz")]
        public async Task<IResult> GetPacjentLekarzaSzczegoly(int pacjentId)
        {
            var (lekarz, error) = await GetCurrentLekarzAsync();
            if (lekarz == null)
                return error!;

            var pacjent = await _db.Pacjenci
                .AsNoTracking()
                .Include(p => p.Wizyty)
                .FirstOrDefaultAsync(p => p.PacjentId == pacjentId);

            if (pacjent == null)
                return Results.NotFound("Pacjent nie istnieje.");

            var maWizyty = await _db.Wizyty
                .AnyAsync(w => w.LekarzId == lekarz.LekarzId && w.PacjentId == pacjentId);

            if (!maWizyty)
                return Results.Forbid();

            var wizyty = await _db.Wizyty
                .AsNoTracking()
                .Where(w => w.LekarzId == lekarz.LekarzId && w.PacjentId == pacjentId)
                .OrderByDescending(w => w.DataWizyty)
                .Select(w => new
                {
                    w.WizytaId,
                    w.DataWizyty,
                    w.Status,
                    w.Diagnoza,
                    Dokumenty = _db.Dokumenty
                        .Where(d => d.WizytaId == w.WizytaId)
                        .Select(d => new
                        {
                            d.DokumentId,
                            d.NazwaPliku,
                            d.TypDokumentu,
                            d.Opis,
                            d.DataUtworzenia
                        })
                        .ToList()
                })
                .ToListAsync();

            return Results.Ok(new
            {
                pacjent.PacjentId,
                pacjent.Imie,
                pacjent.Nazwisko,
                pacjent.Pesel,
                pacjent.DataUrodzenia,
                Wizyty = wizyty
            });
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

        private async Task<(Entities.Lekarz? lekarz, IResult? error)> GetCurrentLekarzAsync()
        {
            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var lekarz = await _db.Lekarze
                .FirstOrDefaultAsync(l => l.UserId == userId);

            if (lekarz == null)
                return (null, Results.NotFound("Nie znaleziono lekarza."));

            return (lekarz, null);
        }




        // PUT / UPDATE
        







    }
}
