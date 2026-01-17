using System.Security.Claims;
using API.Alimed.Data;
using API.Alimed.Dtos;
using API.Alimed.Entities;
using API.Alimed.Enums;
using API.Alimed.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Alimed.Controllers.Wizyty
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class WizytyController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IUserService _userService;
        public WizytyController(AppDbContext db, IUserService userService)
        {
            _db = db;
            _userService = userService;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// GET Requests
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        [HttpGet("moje-wizyty")]
        [Authorize(Roles = "User")]
        public async Task<IResult> GetMojeWizyty()
        {
            var userId = Guid.Parse(
                User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value
            );

            var wizyty = await _db.Wizyty
                .AsNoTracking()
                .Include(w => w.Lekarz)
                .Include(w => w.Placowka)
                .Where(w => w.Pacjent!.UserId == userId)
                .OrderBy(w => w.DataWizyty)
                .Select(w => new
                {
                    w.WizytaId,
                    w.DataWizyty,
                    w.Status,
                    Lekarz = $"{w.Lekarz!.Imie} {w.Lekarz!.Nazwisko}",
                    w.Lekarz!.Specjalizacja,
                    Placowka = w.Placowka!.Nazwa
                })
                .ToListAsync();

            return Results.Ok(wizyty);
        }



        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// 
        // w React
        // GET /api/wizyty/dostepne-terminy
            // ?lekarzId=1
            // &placowkaId=1
            // &from=2026-01-20
            // &to=2026-01-25

        // POST /api/wizyty/umow-wizyte
        // {
        // "lekarzId": 1,
        // "placowkaId": 1,
        // "dataWizyty": "2026-01-22T09:30:00"
        // }

        [HttpGet("dostepne-terminy")]
        [Authorize(Roles = "User")]
        public async Task<IResult> GetDostepneTerminy(
            [FromQuery] int lekarzId,
            [FromQuery] int placowkaId,
            [FromQuery] DateTime from,
            [FromQuery] DateTime to)
        {
            if (to < from)
                return Results.BadRequest("'to' musi być >= 'from'.");

            // 1️⃣ Walidacja lekarza
            var lekarz = await _db.Lekarze
                .AsNoTracking()
                .FirstOrDefaultAsync(l => l.LekarzId == lekarzId);

            if (lekarz == null)
                return Results.BadRequest("Lekarz nie istnieje.");

            if (lekarz.PlacowkaId != placowkaId)
                return Results.BadRequest("Lekarz nie pracuje w tej placówce.");

            // Pobranie godzin pracy lekarza
            var godzinyPracy = await _db.GodzinyPracyLekarzy
                .AsNoTracking()
                .Where(g =>
                    g.LekarzId == lekarzId &&
                    g.PlacowkaId == placowkaId)
                .ToListAsync();

            if (!godzinyPracy.Any())
                return Results.Ok(new
                {
                    lekarzId,
                    placowkaId,
                    available = Array.Empty<DateTime>()
                });

            // Pobranie zajętych terminów
            var zajeteTerminy = await _db.Wizyty
                .AsNoTracking()
                .Where(w =>
                    w.LekarzId == lekarzId &&
                    w.PlacowkaId == placowkaId &&
                    w.Status == StatusWizyty.Zaplanowana &&
                    w.DataWizyty >= from &&
                    w.DataWizyty <= to)
                .Select(w => w.DataWizyty)
                .ToListAsync();

            var zajeteSet = zajeteTerminy.ToHashSet();

            // Generowanie dostępnych slotów
            var available = new List<DateTime>();
            var now = DateTime.Now;

            for (var day = from.Date; day <= to.Date; day = day.AddDays(1))
            {
                var dayOfWeek = day.DayOfWeek;

                var dzienneGodziny = godzinyPracy
                    .Where(g => g.DzienTygodnia == dayOfWeek)
                    .ToList();

                foreach (var g in dzienneGodziny)
                {
                    var slotLength = TimeSpan.FromMinutes(g.CzasWizytyMinuty);
                    var start = day.Add(g.GodzinaOd);
                    var end = day.Add(g.GodzinaDo);

                    for (var t = start; t + slotLength <= end; t += slotLength)
                    {
                        if (t < now)
                            continue;

                        if (!zajeteSet.Contains(t))
                            available.Add(t);
                    }
                }
            }

            return Results.Ok(new
            {
                lekarzId,
                placowkaId,
                from = from.Date,
                to = to.Date,
                available
            });
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        
        





        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// POST Requests
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        [HttpPost]
        [Route("umow-wizyte")]
        [Authorize(Roles = "User")]
        public async Task<IResult> UmowWizyte([FromBody] WizytaCreateDto dto)
        {
            if (!ModelState.IsValid)
                return Results.BadRequest(ModelState);

            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Results.Unauthorized();

            var localUserId = Guid.Parse(userIdClaim);

            var pacjent = await _db.Pacjenci
                .FirstOrDefaultAsync(p => p.UserId == localUserId);

            if (pacjent == null)
                return Results.BadRequest("Nie znaleziono pacjenta powiązanego z użytkownikiem.");

            var lekarz = await _db.Lekarze
                .AsNoTracking()
                .FirstOrDefaultAsync(l => l.LekarzId == dto.LekarzId);

            if (lekarz == null)
                return Results.BadRequest("Podany lekarz nie istnieje.");

            var placowkaExists = await _db.Placowki
                .AnyAsync(p => p.PlacowkaId == dto.PlacowkaId);

            if (!placowkaExists)
                return Results.BadRequest("Podana placówka nie istnieje.");

            if (lekarz.PlacowkaId != dto.PlacowkaId)
                return Results.BadRequest("Wybrany lekarz nie pracuje w tej placówce.");

            bool zajetyTermin = await _db.Wizyty.AnyAsync(w =>
                w.LekarzId == dto.LekarzId &&
                w.DataWizyty == dto.DataWizyty &&
                w.Status == StatusWizyty.Zaplanowana);

            if (zajetyTermin)
                return Results.BadRequest("Ten termin u wybranego lekarza jest już zajęty.");

            var nowaWizyta = new Wizyta
            {
                DataWizyty = dto.DataWizyty,
                Diagnoza = dto.Diagnoza,
                PacjentId = pacjent.PacjentId,
                LekarzId = dto.LekarzId,
                PlacowkaId = dto.PlacowkaId,
                Status = StatusWizyty.Zaplanowana
            };

            try
            {
                _db.Wizyty.Add(nowaWizyta);
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return Results.Conflict("Ten termin został właśnie zajęty przez innego pacjenta.");
            }

            return Results.Created(
                $"/api/wizyty/{nowaWizyta.WizytaId}",
                new
                {
                    Message = "Wizyta została poprawnie umówiona.",
                    WizytaId = nowaWizyta.WizytaId
                }
            );
        }












        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// PUT Requests
        ////////////////////////////////////////////////////////////////////////////////////////////////////////


        /// na froncie
        ///PUT /api/wizyty/123/anuluj
        //Authorization: Bearer <JWT>

        [HttpPut("{id}/anuluj")]
        [Authorize(Roles = "User")]
        public async Task<IResult> AnulujWizyte(int id)
        {
            var userId = Guid.Parse(
                User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value
            );

            var wizyta = await _db.Wizyty
                .Include(w => w.Pacjent)
                .FirstOrDefaultAsync(w => w.WizytaId == id);

            if (wizyta == null)
                return Results.NotFound("Wizyta nie istnieje.");

            if (wizyta.Pacjent.UserId != userId)
                return Results.Forbid();

            if (wizyta.Status != StatusWizyty.Zaplanowana)
                return Results.BadRequest("Tej wizyty nie można już anulować.");

            if (wizyta.DataWizyty < DateTime.UtcNow.AddHours(24))
                return Results.BadRequest("Wizytę można anulować najpóźniej 24h przed terminem.");

            wizyta.Status = StatusWizyty.Anulowana;

            await _db.SaveChangesAsync();

            return Results.Ok(new
            {
                Message = "Wizyta została anulowana.",
                wizyta.WizytaId,
                Status = wizyta.Status.ToString()
            });
        }



        [HttpPut("{id}/odbyta")]
        [Authorize(Roles = "Lekarz")]
        public async Task<IResult> OznaczJakoOdbyta(
            int id,
            [FromBody] string diagnoza)
        {
            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var wizyta = await _db.Wizyty
                .Include(w => w.Lekarz)
                .FirstOrDefaultAsync(w => w.WizytaId == id);

            if (wizyta == null)
                return Results.NotFound();

            if (wizyta.Lekarz.UserId != userId)
                return Results.Forbid();

            if (wizyta.Status != StatusWizyty.Zaplanowana)
                return Results.BadRequest("Nie można zmienić statusu tej wizyty.");

            wizyta.Status = StatusWizyty.Odbyta;
            wizyta.Diagnoza = diagnoza;

            await _db.SaveChangesAsync();

            return Results.Ok("Wizyta oznaczona jako odbyta.");
        }


        [HttpPut("{id}/nieobecnosc")]
        [Authorize(Roles = "Lekarz")]
        public async Task<IResult> OznaczNieobecnosc(int id)
        {
            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var wizyta = await _db.Wizyty
                .Include(w => w.Lekarz)
                .FirstOrDefaultAsync(w => w.WizytaId == id);

            if (wizyta == null)
                return Results.NotFound();

            if (wizyta.Lekarz.UserId != userId)
                return Results.Forbid();

            if (wizyta.Status != StatusWizyty.Zaplanowana)
                return Results.BadRequest();

            wizyta.Status = StatusWizyty.Nieobecnosc;

            await _db.SaveChangesAsync();

            return Results.Ok("Pacjent nie stawił się na wizytę.");
        }

















        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// DELETE Requests
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IResult> DeleteWizyta(int id)
        {
            // TODO
            // Implementacja logiki usuwania wizyty po ID
            return Results.Ok(new { Message = $"Wizyta o ID: {id} została usunięta." });
        }


    }
}
