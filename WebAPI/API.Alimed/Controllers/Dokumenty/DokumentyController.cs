using System.Security.Claims;
using System.Text;
using API.Alimed.Data;
using API.Alimed.Dtos;
using API.Alimed.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Alimed.Controllers.Dokumenty
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DokumentyController : ControllerBase
    {
        private readonly AppDbContext _db;

        public DokumentyController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        [Authorize(Roles = "User")]
        public async Task<IResult> GetMojeDokumenty()
        {
            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var pacjent = await _db.Pacjenci
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (pacjent == null)
                return Results.NotFound("Nie znaleziono pacjenta.");

            var dokumenty = await _db.Dokumenty
                .AsNoTracking()
                .Where(d => d.PacjentId == pacjent.PacjentId)
                .OrderByDescending(d => d.DataUtworzenia)
                .Select(d => new
                {
                    d.DokumentId,
                    d.NazwaPliku,
                    d.TypDokumentu,
                    d.Opis,
                    d.DataUtworzenia,
                    RozmiarPliku = d.Zawartosc != null ? d.Zawartosc.Length : 0,
                    d.WizytaId,
                    d.PacjentId
                })
                .ToListAsync();

            return Results.Ok(dokumenty);
        }

        [HttpGet("wizyty/{wizytaId}")]
        [Authorize(Roles = "User")]
        public async Task<IResult> GetDokumentyDlaWizyty(int wizytaId)
        {
            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var pacjent = await _db.Pacjenci
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (pacjent == null)
                return Results.NotFound("Nie znaleziono pacjenta.");

            var wizyta = await _db.Wizyty
                .AsNoTracking()
                .FirstOrDefaultAsync(w => w.WizytaId == wizytaId && w.PacjentId == pacjent.PacjentId);

            if (wizyta == null)
                return Results.NotFound("Wizyta nie istnieje.");

            var dokumenty = await _db.Dokumenty
                .AsNoTracking()
                .Where(d => d.WizytaId == wizytaId && d.PacjentId == pacjent.PacjentId)
                .OrderByDescending(d => d.DataUtworzenia)
                .Select(d => new
                {
                    d.DokumentId,
                    d.NazwaPliku,
                    d.TypDokumentu,
                    d.Opis,
                    d.DataUtworzenia,
                    RozmiarPliku = d.Zawartosc != null ? d.Zawartosc.Length : 0,
                    d.WizytaId,
                    d.PacjentId
                })
                .ToListAsync();

            return Results.Ok(dokumenty);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "User")]
        public async Task<IResult> GetDokument(int id)
        {
            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var dokument = await _db.Dokumenty
                .AsNoTracking()
                .Where(d =>
                    d.DokumentId == id &&
                    d.Pacjent != null &&
                    d.Pacjent.UserId == userId)
                .Select(d => new
                {
                    d.DokumentId,
                    d.NazwaPliku,
                    d.TypDokumentu,
                    d.Opis,
                    d.DataUtworzenia,
                    RozmiarPliku = d.Zawartosc != null ? d.Zawartosc.Length : 0,
                    d.WizytaId,
                    d.PacjentId
                })
                .FirstOrDefaultAsync();

            if (dokument == null)
                return Results.NotFound("Dokument nie istnieje.");

            return Results.Ok(dokument);
        }

        [HttpGet("{id}/download")]
        [Authorize(Roles = "User,Lekarz")]
        public async Task<IResult> DownloadDokument(int id)
        {
            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var dokument = await _db.Dokumenty
                .Include(d => d.Pacjent)
                .AsNoTracking()
                .FirstOrDefaultAsync(d => d.DokumentId == id);

            if (dokument == null)
                return Results.NotFound("Dokument nie istnieje.");

            // Check access
            bool hasAccess = false;

            // 1. Is Patient owner?
            if (dokument.Pacjent != null && dokument.Pacjent.UserId == userId)
            {
                hasAccess = true;
            }
            // 2. Is Doctor owner?
            else
            {
                var lekarz = await _db.Lekarze
                    .AsNoTracking()
                    .FirstOrDefaultAsync(l => l.UserId == userId);
                
                if (lekarz != null && dokument.LekarzId == lekarz.LekarzId)
                {
                    hasAccess = true;
                }
            }

            if (!hasAccess)
                return Results.Forbid();

            var content = dokument.Zawartosc ?? Array.Empty<byte>();
            var contentType = string.IsNullOrWhiteSpace(dokument.TypMime)
                ? "application/octet-stream"
                : dokument.TypMime;
            var fileName = string.IsNullOrWhiteSpace(dokument.NazwaPliku)
                ? $"dokument-{dokument.DokumentId}.txt"
                : dokument.NazwaPliku;

            return Results.File(content, contentType, fileName);
        }

        [HttpPost]
        [Authorize(Roles = "Lekarz")]
        public async Task<IResult> CreateDokument([FromBody] DokumentCreateDto dto)
        {
            if (!ModelState.IsValid)
                return Results.BadRequest(ModelState);

            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var lekarz = await _db.Lekarze
                .FirstOrDefaultAsync(l => l.UserId == userId);

            if (lekarz == null)
                return Results.NotFound("Nie znaleziono lekarza.");

            var wizyta = await _db.Wizyty
                .Include(w => w.Pacjent)
                .FirstOrDefaultAsync(w => w.WizytaId == dto.WizytaId);

            if (wizyta == null)
                return Results.NotFound("Nie znaleziono wizyty.");

            if (wizyta.LekarzId != lekarz.LekarzId)
                return Results.Forbid();

            if (wizyta.PacjentId == null)
                return Results.BadRequest("Wizyta nie ma przypisanego pacjenta.");

            var contentText = dto.Tresc ?? string.Empty;
            var content = Encoding.UTF8.GetBytes(contentText);
            var fileName = string.IsNullOrWhiteSpace(dto.NazwaPliku)
                ? $"dokument-{dto.WizytaId}-{DateTime.Now:yyyyMMddHHmmss}.txt"
                : dto.NazwaPliku;

            var dokument = new Dokument
            {
                WizytaId = wizyta.WizytaId,
                PacjentId = wizyta.PacjentId.Value,
                LekarzId = lekarz.LekarzId,
                NazwaPliku = fileName,
                TypDokumentu = dto.TypDokumentu,
                Opis = dto.Opis,
                DataUtworzenia = DateTime.Now,
                Zawartosc = content,
                TypMime = "text/plain"
            };

            _db.Dokumenty.Add(dokument);
            await _db.SaveChangesAsync();

            return Results.Created($"/api/dokumenty/{dokument.DokumentId}", new
            {
                dokument.DokumentId,
                dokument.NazwaPliku,
                dokument.TypDokumentu,
                dokument.Opis,
                dokument.DataUtworzenia,
                RozmiarPliku = dokument.Zawartosc.Length,
                dokument.WizytaId,
                dokument.PacjentId
            });
        }

        [HttpGet("wizyty/{wizytaId}/lekarz")]
        [Authorize(Roles = "Lekarz")]
        public async Task<IResult> GetDokumentyDlaWizytyLekarza(int wizytaId)
        {
            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var lekarz = await _db.Lekarze
                .AsNoTracking()
                .FirstOrDefaultAsync(l => l.UserId == userId);

            if (lekarz == null)
                return Results.NotFound("Nie znaleziono lekarza.");

            var wizyta = await _db.Wizyty
                .AsNoTracking()
                .FirstOrDefaultAsync(w => w.WizytaId == wizytaId && w.LekarzId == lekarz.LekarzId);

            if (wizyta == null)
                return Results.NotFound("Wizyta nie istnieje.");

            var dokumenty = await _db.Dokumenty
                .AsNoTracking()
                .Where(d => d.WizytaId == wizytaId && d.LekarzId == lekarz.LekarzId)
                .OrderByDescending(d => d.DataUtworzenia)
                .Select(d => new
                {
                    d.DokumentId,
                    d.NazwaPliku,
                    d.TypDokumentu,
                    d.Opis,
                    d.DataUtworzenia,
                    RozmiarPliku = d.Zawartosc != null ? d.Zawartosc.Length : 0,
                    d.WizytaId,
                    d.PacjentId
                })
                .ToListAsync();

            return Results.Ok(dokumenty);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Lekarz")]
        public async Task<IResult> UpdateDokument(int id, [FromBody] DokumentUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return Results.BadRequest(ModelState);

            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var lekarz = await _db.Lekarze
                .FirstOrDefaultAsync(l => l.UserId == userId);

            if (lekarz == null)
                return Results.NotFound("Nie znaleziono lekarza.");

            var dokument = await _db.Dokumenty
                .FirstOrDefaultAsync(d => d.DokumentId == id);

            if (dokument == null)
                return Results.NotFound("Dokument nie istnieje.");

            if (dokument.LekarzId != lekarz.LekarzId)
                return Results.Forbid();

            dokument.TypDokumentu = dto.TypDokumentu;
            dokument.NazwaPliku = string.IsNullOrWhiteSpace(dto.NazwaPliku) ? dokument.NazwaPliku : dto.NazwaPliku;
            dokument.Opis = dto.Opis;

            if (dto.Tresc != null)
            {
                dokument.Zawartosc = Encoding.UTF8.GetBytes(dto.Tresc);
                dokument.TypMime = "text/plain";
            }

            await _db.SaveChangesAsync();

            return Results.Ok(new
            {
                dokument.DokumentId,
                dokument.NazwaPliku,
                dokument.TypDokumentu,
                dokument.Opis,
                dokument.DataUtworzenia,
                RozmiarPliku = dokument.Zawartosc != null ? dokument.Zawartosc.Length : 0,
                dokument.WizytaId,
                dokument.PacjentId
            });
        }
    }
}
