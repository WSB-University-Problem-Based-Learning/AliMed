using API.Alimed.Data;
using API.Alimed.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Alimed.Controllers.Pacjenci
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PacjenciController : ControllerBase
    {
        private readonly AppDbContext _db;

        public PacjenciController(AppDbContext db)
        {
            _db = db;
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// GET Requests
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpGet]
        [Route("moj-profil")]
        [Authorize(Roles = "User, Admin")]
        public async Task<IActionResult> GetMojProfil()
        {
            // TODO



            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;




            if (string.IsNullOrEmpty(userIdStr))
                return Unauthorized("Nie znaleziono ID użytkownika w tokenie.");

            var userId = Guid.Parse(userIdStr);

            var pacjent = await _db.Pacjenci
                .Include(p => p.AdresZamieszkania)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (pacjent == null)
                return NotFound("Pacjent nie istnieje.");

            return Ok(new
            {
                pacjent.PacjentId,
                pacjent.Imie,
                pacjent.Nazwisko,
                pacjent.Pesel,
                pacjent.DataUrodzenia,
                Adres = new
                {
                    pacjent.AdresZamieszkania.Ulica,
                    pacjent.AdresZamieszkania.NumerDomu,
                    pacjent.AdresZamieszkania.KodPocztowy,
                    pacjent.AdresZamieszkania.Miasto,
                    pacjent.AdresZamieszkania.Kraj
                }
            });

        }





        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// PUT Requests
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpPut("moj-profil")]
        [Authorize(Roles = "User, Admin")]
        public async Task<IActionResult> UpdateMyProfile([FromBody] UpdatePacjentProfileDto dto)
        {


            //
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            //




            if (string.IsNullOrEmpty(userIdStr))
                return Unauthorized("Brak UserId w tokenie.");

            var userId = Guid.Parse(userIdStr);

            var pacjent = await _db.Pacjenci
                .Include(p => p.AdresZamieszkania)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (pacjent == null)
                return NotFound("Pacjent nie istnieje.");

            // Aktualizacja danych
            pacjent.Imie = dto.Imie;
            pacjent.Nazwisko = dto.Nazwisko;
            pacjent.Pesel = dto.Pesel;
            pacjent.DataUrodzenia = dto.DataUrodzenia;

            pacjent.AdresZamieszkania.Ulica = dto.Ulica;
            pacjent.AdresZamieszkania.NumerDomu = dto.NumerDomu;
            pacjent.AdresZamieszkania.KodPocztowy = dto.KodPocztowy;
            pacjent.AdresZamieszkania.Miasto = dto.Miasto;
            pacjent.AdresZamieszkania.Kraj = dto.Kraj;

            await _db.SaveChangesAsync();

            return Ok(new { message = "Dane zostały zaktualizowane." });
        }




    }
}
