using API.Alimed.Data;
using API.Alimed.Dtos;
using API.Alimed.Entities;
using API.Alimed.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Alimed.Controllers.Admin;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("admin-profile")]
    public async Task<IActionResult> GetAdminDashboard()
    {
        return Ok("Admin profile here");
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsersFromDbAdminDashboard()
    {
        var usersList = await _db.Users
            .AsNoTracking()
            .OrderBy(u => u.Username)
            .Select(u => new
            {
                u.UserId,
                u.Username,
                u.Email,
                Role = u.Role.ToString(),
                u.IsGithubUser,
                HasPacjent = u.Pacjent != null,
                HasLekarz = _db.Lekarze.Any(l => l.UserId == u.UserId)
            })
            .ToListAsync();

        return Ok(usersList);
    }

    [HttpGet("users/{userId}/role")]
    public async Task<IActionResult> GetUserRole(string userId)
    {
        var userRole = await _db.Users
            .Where(u => u.UserId.ToString() == userId)
            .Select(u => u.Role)
            .FirstOrDefaultAsync();

        return Ok(userRole);
    }

    [HttpGet("pacjenci")]
    public async Task<IActionResult> GetPacjenciZWizytami()
    {
        var pacjenci = await _db.Pacjenci
            .AsNoTracking()
            .OrderBy(p => p.Nazwisko)
            .Select(p => new
            {
                p.PacjentId,
                p.Imie,
                p.Nazwisko,
                p.Pesel,
                p.DataUrodzenia,
                Wizyty = _db.Wizyty
                    .Where(w => w.PacjentId == p.PacjentId)
                    .OrderByDescending(w => w.DataWizyty)
                    .Select(w => new
                    {
                        w.WizytaId,
                        w.DataWizyty,
                        w.Status,
                        w.Diagnoza,
                        Lekarz = w.Lekarz != null ? w.Lekarz.Imie + " " + w.Lekarz.Nazwisko : null,
                        w.Lekarz!.Specjalizacja,
                        Placowka = w.Placowka != null ? w.Placowka.Nazwa : null,
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
                    .ToList()
            })
            .ToListAsync();

        return Ok(pacjenci);
    }

    [HttpGet("lekarze")]
    public async Task<IActionResult> GetLekarze()
    {
        var lekarze = await _db.Lekarze
            .AsNoTracking()
            .OrderBy(l => l.Nazwisko)
            .Select(l => new
            {
                l.LekarzId,
                l.Imie,
                l.Nazwisko,
                l.Specjalizacja,
                l.PlacowkaId,
                Placowka = l.Placowka != null ? l.Placowka.Nazwa : null,
                UserId = l.UserId,
                Email = l.User != null ? l.User.Email : null,
                Username = l.User != null ? l.User.Username : null
            })
            .ToListAsync();

        return Ok(lekarze);
    }

    [HttpPut("users/{userId}/promote-to-doctor")]
    public async Task<IResult> PromoteUserToDoctor(Guid userId, [FromBody] AdminPromoteToDoctorDto dto)
    {
        if (!ModelState.IsValid)
            return Results.BadRequest(ModelState);

        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.UserId == userId);

        if (user == null)
            return Results.NotFound("User nie istnieje.");

        if (user.Role == UserRole.Admin)
            return Results.BadRequest("Nie mozna zmienic roli admina.");

        if (user.Role == UserRole.Lekarz)
            return Results.BadRequest("User ma juz role lekarza.");

        var lekarzExists = await _db.Lekarze
            .AnyAsync(l => l.UserId == userId);

        if (lekarzExists)
            return Results.BadRequest("Lekarz dla tego usera juz istnieje.");

        var placowkaExists = await _db.Placowki
            .AnyAsync(p => p.PlacowkaId == dto.PlacowkaId);

        if (!placowkaExists)
            return Results.BadRequest("Podana placowka nie istnieje.");

        var pacjent = await _db.Pacjenci
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (pacjent == null)
            return Results.BadRequest("Brak pacjenta powiazanego z tym userem.");

        if (string.IsNullOrWhiteSpace(pacjent.Imie) || string.IsNullOrWhiteSpace(pacjent.Nazwisko))
            return Results.BadRequest("Pacjent nie ma uzupelnionego imienia i nazwiska.");

        var wizyty = await _db.Wizyty
            .Where(w => w.PacjentId == pacjent.PacjentId)
            .ToListAsync();

        foreach (var wizyta in wizyty)
        {
            wizyta.PacjentId = null;
        }

        _db.Pacjenci.Remove(pacjent);

        var lekarz = new Lekarz
        {
            Imie = pacjent.Imie,
            Nazwisko = pacjent.Nazwisko,
            Specjalizacja = dto.Specjalizacja,
            PlacowkaId = dto.PlacowkaId,
            UserId = userId
        };

        _db.Lekarze.Add(lekarz);
        user.Role = UserRole.Lekarz;

        await _db.SaveChangesAsync();

        var godziny = new List<GodzinyPracyLekarza>();
        foreach (var day in new[]
        {
            DayOfWeek.Monday,
            DayOfWeek.Tuesday,
            DayOfWeek.Wednesday,
            DayOfWeek.Thursday,
            DayOfWeek.Friday
        })
        {
            godziny.Add(new GodzinyPracyLekarza
            {
                LekarzId = lekarz.LekarzId,
                PlacowkaId = lekarz.PlacowkaId ?? dto.PlacowkaId,
                DzienTygodnia = day,
                GodzinaOd = new TimeSpan(8, 0, 0),
                GodzinaDo = new TimeSpan(16, 0, 0),
                CzasWizytyMinuty = 30
            });
        }

        _db.GodzinyPracyLekarzy.AddRange(godziny);
        await _db.SaveChangesAsync();

        return Results.Ok(new
        {
            Message = "User zostal zmieniony na lekarza.",
            user.UserId,
            lekarz.LekarzId
        });
    }
}
