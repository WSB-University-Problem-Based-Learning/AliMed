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
                    w.Diagnoza,
                    CzyOdbyta = w.Status == StatusWizyty.Zrealizowana,
                    Lekarz = w.Lekarz != null ? new
                    {
                        LekarzId = w.Lekarz.LekarzId,
                        Imie = w.Lekarz.Imie,
                        Nazwisko = w.Lekarz.Nazwisko,
                        Specjalizacja = w.Lekarz.Specjalizacja
                    } : null,
                    Placowka = w.Placowka != null ? new
                    {
                        PlacowkaId = w.Placowka.PlacowkaId,
                        Nazwa = w.Placowka.Nazwa,
                        AdresPlacowki = w.Placowka.AdresPlacowki
                    } : null
                })
                .ToListAsync();

            return Results.Ok(wizyty);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "User,Lekarz")]
        public async Task<IResult> GetMojaWizyta(int id)
        {
            var userId = Guid.Parse(
                User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value
            );

            var wizyta = await _db.Wizyty
                .AsNoTracking()
                .Include(w => w.Lekarz)
                .Include(w => w.Placowka)
                .Include(w => w.Pacjent)
                .FirstOrDefaultAsync(w => w.WizytaId == id);

            if (wizyta == null)
                return Results.NotFound("Wizyta nie istnieje.");

            // Check access
            bool hasAccess = false;

            // 1. Is Patient owner?
            if (wizyta.Pacjent != null && wizyta.Pacjent.UserId == userId)
            {
                hasAccess = true;
            }
            // 2. Is Doctor owner?
            else if (wizyta.Lekarz != null && wizyta.Lekarz.UserId == userId)
            {
                hasAccess = true;
            }

            if (!hasAccess)
                return Results.Forbid();

            var dokumenty = await _db.Dokumenty
                .AsNoTracking()
                .Where(d => d.WizytaId == wizyta.WizytaId)
                .OrderByDescending(d => d.DataUtworzenia)
                .Select(d => new
                {
                    d.DokumentId,
                    d.NazwaPliku,
                    d.TypDokumentu,
                    d.Opis,
                    d.DataUtworzenia
                })
                .ToListAsync();

            return Results.Ok(new
            {
                wizyta.WizytaId,
                wizyta.DataWizyty,
                wizyta.Status,
                wizyta.Diagnoza,
                Lekarz = $"{wizyta.Lekarz!.Imie} {wizyta.Lekarz!.Nazwisko}",
                wizyta.Lekarz!.Specjalizacja,
                Placowka = wizyta.Placowka!.Nazwa,
                Dokumenty = dokumenty
            });
        }





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

            var startDate = from.Date;
            var endDate = to.Date.AddDays(1);

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
                    w.Status == StatusWizyty.Zaplanowana &&
                    w.DataWizyty >= startDate &&
                    w.DataWizyty < endDate &&
                    (w.PlacowkaId == placowkaId || w.PlacowkaId == null))
                .Select(w => w.DataWizyty)
                .ToListAsync();

            var zajeteSet = zajeteTerminy.ToHashSet();

            // Generowanie dostępnych slotów
            var available = new List<DateTime>();
            var now = DateTime.Now;

            for (var day = startDate; day < endDate; day = day.AddDays(1))
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
                from = startDate,
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
        [Authorize(Roles = "User,Lekarz")]
        public async Task<IResult> AnulujWizyte(int id)
        {
            var userId = Guid.Parse(
                User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value
            );

            var wizyta = await _db.Wizyty
                .Include(w => w.Pacjent)
                .Include(w => w.Lekarz)
                .FirstOrDefaultAsync(w => w.WizytaId == id);

            if (wizyta == null)
                return Results.NotFound("Wizyta nie istnieje.");

            var isPacjentOwner = wizyta.Pacjent != null && wizyta.Pacjent.UserId == userId;
            var isLekarzOwner = wizyta.Lekarz != null && wizyta.Lekarz.UserId == userId;

            if (!isPacjentOwner && !isLekarzOwner)
                return Results.Forbid();

            if (wizyta.Status == StatusWizyty.Zrealizowana)
                return Results.BadRequest("Nie można anulować zrealizowanej wizyty.");

            if (wizyta.Status == StatusWizyty.Anulowana)
                return Results.BadRequest("Wizyta jest już anulowana.");

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

            wizyta.Status = StatusWizyty.Zrealizowana;
            wizyta.Diagnoza = diagnoza;

            await _db.SaveChangesAsync();

            return Results.Ok("Wizyta oznaczona jako zrealizowana.");
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
