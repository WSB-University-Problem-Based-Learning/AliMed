using API.Alimed.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Alimed.Controllers.Placowki
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlacowkiController : ControllerBase
    {
        private readonly AppDbContext _db;

        public PlacowkiController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        [Authorize(Roles = "User")]
        public async Task<IResult> GetPlacowki()
        {
            var placowki = await _db.Placowki
                .AsNoTracking()
                .Select(p => new
                {
                    p.PlacowkaId,
                    p.Nazwa,
                    Adres = new
                    {
                        p.AdresPlacowki!.Miasto,
                        p.AdresPlacowki!.Ulica
                    }
                })
                .ToListAsync();

            return Results.Ok(placowki);
        }






        
    }
}
