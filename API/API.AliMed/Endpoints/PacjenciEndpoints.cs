using API.AliMed.Data;
using API.AliMed.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.AliMed.Endpoints
{
    public class PacjenciEndpoints
    {
        private const string BasePath = "/pacjenci";

        public static void MapPacjenciEndpoints(WebApplication app)
        {
            var pacjenciEndPoint = app.MapGroup(BasePath);

            // pacjenci endpoints declaration
            pacjenciEndPoint.MapGet("/", GetAllPacjenci);
            pacjenciEndPoint.MapGet("/{id:int}", GetPacjentById);
            //pacjenciEndPoint.MapPost("/", CreatePacjent);
            //pacjenciEndPoint.MapPut("/{id:int}", UpdatePacjent);
            //pacjenciEndPoint.MapDelete("/{id:int}", DeletePacjent);
        }

        private static async Task<IResult> GetAllPacjenci(AppDbContext db)
                => Results.Ok(await db.Pacjenci.ToListAsync());

        private static async Task<IResult> GetPacjentById(int id, AppDbContext db)
            => await db.Pacjenci.FindAsync(id)
                is Pacjent p ? Results.Ok(p) : Results.NotFound();

    } 
}
