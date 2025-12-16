using API.AliMed.Data;
using API.AliMed.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.AliMed.Endpoints
{
    public static class DokumentyEndpoints
    {
        public static void MapDokumentyEndpoints(IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/dokumenty");

            group.MapGet("/", GetAllDokumenty);
            group.MapGet("/{id:int}", GetDokumentById);
            group.MapGet("/{id:int}/download", DownloadDokument);
        }

        private static async Task<IResult> GetAllDokumenty(AppDbContext db)
        {
            var dokumenty = await db.Dokumenty
                .AsNoTracking()
                .OrderByDescending(d => d.DataUtworzenia)
                .ToListAsync();
            return Results.Ok(dokumenty);
        }

        private static async Task<IResult> GetDokumentById(int id, AppDbContext db)
        {
            var dokument = await db.Dokumenty.AsNoTracking().FirstOrDefaultAsync(d => d.DokumentId == id);
            return dokument is null ? Results.NotFound() : Results.Ok(dokument);
        }

        private static async Task<IResult> DownloadDokument(int id, AppDbContext db)
        {
            var dokument = await db.Dokumenty.AsNoTracking().FirstOrDefaultAsync(d => d.DokumentId == id);
            if (dokument is null || dokument.ZawartoscPliku is null)
            {
                return Results.NotFound();
            }

            var fileName = string.IsNullOrWhiteSpace(dokument.NazwaPliku)
                ? $"dokument-{dokument.DokumentId}.pdf"
                : dokument.NazwaPliku;

            return Results.File(dokument.ZawartoscPliku, "application/pdf", fileName);
        }
    }
}
